<template>
  <v-row>
    <v-col cols="auto">
      <v-card>
        <v-card-text>
          <v-card-title>Total balance</v-card-title>
          {{ totalBalance }} ETH
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-select
        v-model="currency"
        :items="currencies"
        return-object
        item-text="desc"
        chips
      ></v-select>

      <v-text-field v-model="currency.rate" label="Rate"> </v-text-field>
    </v-col>

    <v-col cols="auto">
      <v-card>
        <v-card-text>
          <v-card-title>Total</v-card-title>
          {{ (totalBalance * currency.rate) | 2 }} {{ currency.symbol }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-dialog max-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" color="primary">add</v-btn>
        </template>

        <v-card>
          <v-card-text>
            <v-card-title>Enter the wallet address</v-card-title>
            <v-text-field
              v-model="newWalletAddress"
              label="Wallet address"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="addWallet()"> add </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>

    <v-col cols="12">
      <v-data-table
        :items="wallets"
        :headers="headers"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:[`item.balance`]="{ item }">
          <span v-if="item.balance">{{ item.balance }} ETH</span>
          <span v-else>None</span>
        </template>

        <template v-slot:[`item.tags`]="{ item }">
          <v-chip v-if="isOld(item)"> Old </v-chip>
          <v-icon color="warning" v-if="item.favorite">mdi-star</v-icon>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="warning" @click="toggleFavorite(item)">
            <v-icon>mdi-star</v-icon>
          </v-btn>

          <v-btn icon color="error" @click="deleteWallet(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',

  created() {
    this.fetchWallets()

    this.currency = this.currencies[0]
  },

  data() {
    return {
      newWalletAddress: null,

      currencies: [
        { desc: 'USD', rate: 1, symbol: '$' },
        { desc: 'EUR', rate: 1.15, symbol: '€' },
      ],

      currency: null,

      headers: [
        { text: 'Address', value: 'address' },
        { text: 'Balance', value: 'balance' },
        { text: 'Tags', value: 'tags' },
        { text: 'Actions', value: 'actions' },
      ],
    }
  },

  methods: {
    fetchWallets() {
      this.$store.dispatch('fetchWallets')
    },

    deleteWallet(wallet) {
      this.$store.dispatch('deleteWallet', wallet)
    },

    addWallet() {
      this.$store.dispatch('addWallet', this.newWalletAddress)
      this.newWalletAddress = null
    },

    isOld(wallet) {
      return wallet.oldest_transaction != null
        ? ((Date.now() / 1000) | 0) - wallet.oldest_transaction > 3.154e7
        : false
    },

    toggleFavorite(wallet) {
      this.$store.dispatch('toggleFavorite', wallet)
    },
  },

  computed: {
    wallets() {
      return this.$store.state.wallets
    },

    totalBalance() {
      let balances = this.$store.state.wallets.map((wallet) => {
        if (!isNaN(wallet.balance)) {
          return parseFloat(wallet.balance)
        } else {
          return 0
        }
      })

      return balances.length > 0 ? balances.reduce((pre, cur) => pre + cur) : 0
    },
  },
}
</script>
