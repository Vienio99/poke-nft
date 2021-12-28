import { configureStore } from "@reduxjs/toolkit";
import blockchainReducer from "./blockchain/blockchainSlice";
import dataReducer from "./data/dataSlice";

export const store = configureStore({
  reducer: {
    blockchain: blockchainReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.pokeToken", "payload.web3"],
        // Ignore these paths in the state
        ignoredPaths: ["blockchain.pokeToken", "blockchain.web3"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
