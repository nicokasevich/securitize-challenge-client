export const state = () => ({
  wallets: [],
})

export const mutations = {
  setWallets(state, wallets) {
    state.wallets = wallets
  },

  removeWallet(state, wallet) {
    state.wallets.shift(state.wallets.indexOf(wallet), 1)
  },

  addWallet(state, wallet) {
    state.wallets.unshift(wallet)
  },

  updateWallet(state, wallet) {
    state.wallets = [
      ...state.wallets.filter((item) => item._id !== wallet._id),
      wallet,
    ]
  },
}

export const getters = {
  getWallets(state) {
    return state.wallets
  },
}

export const actions = {
  async fetchWallets({ commit, dispatch }) {
    const response = await this.$axios.$get('http://localhost:8000/wallets')

    commit('setWallets', response)
  },

  async deleteWallet({ commit }, wallet) {
    await this.$axios.$delete(`http://localhost:8000/wallets/${wallet._id}`)
    commit('removeWallet', wallet)
  },

  async addWallet({ commit }, address) {
    const createdWallet = await this.$axios.$put(
      `http://localhost:8000/wallets`,
      {
        address: address,
      }
    )

    commit('addWallet', createdWallet)
  },

  async toggleFavorite({ commit }, wallet) {
    const updatedWallet = await this.$axios.$patch(
      `http://localhost:8000/wallets/${wallet._id}`,
      {
        favorite: !wallet.favorite,
      }
    )

    commit('updateWallet', updatedWallet)
  },
}
