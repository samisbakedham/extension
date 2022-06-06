import { createSelector, createSlice } from "@reduxjs/toolkit"
import Emittery from "emittery"
import {
  ExpectedSigningData,
  SignDataMessageType,
  SignDataRequest,
  SigningMethod,
  SignTypedDataRequest,
} from "../utils/signing"
import { createBackgroundAsyncThunk } from "./utils"
import { EnrichedSignTypedDataRequest } from "../services/enrichment"
import { EIP712TypedData } from "../types"
import { AddressOnNetwork } from "../accounts"
import { EIP1559TransactionRequest } from "../networks"

type SignOperation<T> = {
  request: T
  signingMethod: SigningMethod
}

export type SigningRequest =
  | {
      // FIXME Consider unifying with SignOperation.
      transactionRequest: EIP1559TransactionRequest
      broadcastOnSign: boolean
    }
  | {
      // FIXME Consider subtypes of SignOperation instead of SignOperation<T>.
      signingOperation: SignOperation<SignDataRequest | SignTypedDataRequest>
    }

type Events = {
  requestSignTypedData: {
    typedData: EIP712TypedData
    account: AddressOnNetwork
    signingMethod: SigningMethod
  }
  requestSignData: {
    signingData: ExpectedSigningData
    messageType: SignDataMessageType
    rawSigningData: string
    account: AddressOnNetwork
    signingMethod: SigningMethod
  }
  signatureRejected: never
}

export const signingSliceEmitter = new Emittery<Events>()

type SigningState = {
  signedTypedData: string | undefined
  typedDataRequest: EnrichedSignTypedDataRequest | undefined

  signedData: string | undefined
  signDataRequest: SignDataRequest | undefined
}

export const initialState: SigningState = {
  typedDataRequest: undefined,
  signedTypedData: undefined,

  signedData: undefined,
  signDataRequest: undefined,
}

export const signTypedData = createBackgroundAsyncThunk(
  "signing/signTypedData",
  async (data: SignOperation<SignTypedDataRequest>) => {
    const {
      request: { account, typedData },
      signingMethod,
    } = data

    await signingSliceEmitter.emit("requestSignTypedData", {
      typedData,
      account,
      signingMethod,
    })
  }
)

export const signData = createBackgroundAsyncThunk(
  "signing/signData",
  async (data: SignOperation<SignDataRequest>) => {
    const {
      request: { account, signingData, rawSigningData, messageType },
      signingMethod,
    } = data
    await signingSliceEmitter.emit("requestSignData", {
      rawSigningData,
      signingData,
      account,
      messageType,
      signingMethod,
    })
  }
)

const signingSlice = createSlice({
  name: "signing",
  initialState,
  reducers: {
    signedTypedData: (state, { payload }: { payload: string }) => ({
      ...state,
      signedTypedData: payload,
      typedDataRequest: undefined,
    }),
    typedDataRequest: (
      state,
      { payload }: { payload: EnrichedSignTypedDataRequest }
    ) => ({
      ...state,
      typedDataRequest: payload,
    }),
    signDataRequest: (state, { payload }: { payload: SignDataRequest }) => {
      return {
        ...state,
        signDataRequest: payload,
      }
    },
    signedData: (state, { payload }: { payload: string }) => ({
      ...state,
      signedData: payload,
      signDataRequest: undefined,
    }),
    clearSigningState: (state) => ({
      ...state,
      typedDataRequest: undefined,
      signDataRequest: undefined,
    }),
  },
})

export const {
  signedTypedData,
  typedDataRequest,
  signedData,
  signDataRequest,
  clearSigningState,
} = signingSlice.actions

export default signingSlice.reducer

export const selectTypedData = createSelector(
  (state: { signing: SigningState }) => state.signing.typedDataRequest,
  (signTypes) => signTypes
)

export const selectSigningData = createSelector(
  (state: { signing: SigningState }) => state.signing.signDataRequest,
  (signTypes) => signTypes
)

export const rejectDataSignature = createBackgroundAsyncThunk(
  "signing/reject",
  async (_, { dispatch }) => {
    await signingSliceEmitter.emit("signatureRejected")
    // Provide a clean slate for future transactions.
    dispatch(signingSlice.actions.clearSigningState())
  }
)
