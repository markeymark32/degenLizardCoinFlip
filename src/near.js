import React, { useContext, createContext, useEffect } from "react";

import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  utils,
} from "near-api-js";
import getConfig from "./config";
import { Buffer } from "buffer";
global.Buffer = Buffer;

const nearConfig = getConfig(process.env.REACT_APP_ENVIRONMENT || "development");

export const NearContext = createContext(null);

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near);

  // Initializing our contract APIs by contract name and configuration
  const contract = await new Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        "get_fees",
        "get_chance",
        "get_fee_wallet",
        "get_team_wallet",
        "get_last_bets",
      ],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["play"],
    }
  );

  return {
    near,
    walletConnection,
    contract,
  };
}

export function useNear() {
  const context = useContext(NearContext);
  if (context === null) {
    throw new Error("useNear must be used within a NearProvider.");
  }
  const accountId = context.walletConnection.getAccountId();

  const signIn = () => {
    context.walletConnection.requestSignIn({
      contractId: nearConfig.contractName,
    });
  };

  const signOut = () => {
    context.walletConnection.signOut();
    window.location.replace(window.location.href);
  };

  // context.walletConnection.getAccountId()
  return {
    isLoggedIn: !!accountId,
    accountId,
    signIn,
    signOut,
  };
}

export function useCoinFlip() {
  const context = useContext(NearContext);
  console.log(context.contract);
  if (context === null) {
    throw new Error("useNear must be used within a NearProvider.");
  }
  const fee = 1.035;

  const play = async (amount, side) => {
    const amountWithFee = amount * fee;

    console.log(
      "Playing",
      side,
      amountWithFee,
      utils.format.parseNearAmount(amountWithFee.toString())
    );

    await context.contract.play(
      {
        bet_value: side,
      },
      "300000000000000",
      utils.format.parseNearAmount(amountWithFee.toString())
    );
  };

  const getOutcome = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = urlSearchParams.get("transactionHashes");

    if (!params) {
      return null;
    }

    const result = await context.near.connection.provider.txStatus(
      params,
      nearConfig.contractName
    );

    // console.log(result);
    // console.log(result.transaction.actions[0].FunctionCall.deposit);
    const originalBet =
      parseFloat(
        utils.format.formatNearAmount(
          result.transaction.actions[0].FunctionCall.deposit
        )
      ) / fee;

    const resultVal = result.status.SuccessValue;
    const outcomeJson = Buffer.from(resultVal, "base64").toString();
    const outcome = JSON.parse(outcomeJson);

    return { outcome, originalBet };
  };
  return {
    play,
    getOutcome,
  };
}