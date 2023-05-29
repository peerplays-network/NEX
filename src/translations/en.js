export const en = {
  general: {
    yes: "Yes",
    no: "No",
    limit: "Limit",
  },
  app_init: {
    check_latency: "Running latency checks...",
    check_latency_feedback:
      "Running latency checks (%(pinged)s/%(totalToPing)s nodes)",
    check_latency_feedback_country:
      "Latency check in best country (%(pinged)s/%(totalToPing)s nodes)",
    check_latency_feedback_last:
      "Latency check for last connected node (%(pinged)s/%(totalToPing)s nodes)",
    check_latency_feedback_region:
      "Latency check in best region (%(pinged)s/%(totalToPing)s nodes)",
    check_latency_feedback_rest:
      "Latency check for remaining nodes (%(pinged)s/%(totalToPing)s nodes)",
    check_latency_feedback_world:
      "Latency check in each region (%(pinged)s/%(totalToPing)s nodes)",
    connecting: "Connecting to API server: %(server)s",
    sync_error: {
      title: "Failed to sync with the API server",
      first_description: "Please verify that your computer clock is correct",
      second_description:
        "Once you've synchronized your clock, please refresh this page",
    },
    connection_error: {
      title: "Connection Error",
      first_description:
        "Peerplays DEX can't find a running node to connect to the blockchain.",
      second_description:
        "Please check your node connection and refresh the page.",
    },
  },
  transaction: {
    trade: "Trade",
    transaction_type: "Transaction Type: ",
    feeTypes: {
      _none: "Free of Charge",
      basic_fee: "Basic Fee",
      distribution_base_fee: "Distribution base fee",
      distribution_fee_per_holder: "Distribution price per holder",
      fee: "Regular Transaction Fee",
      fee_per_day: "Price per day",
      fee_per_kb: "Price per KByte Transaction Size",
      long_symbol: "Longer Symbols",
      lottery_asset: "Lottery asset",
      membership_annual_fee: "Annual Membership",
      membership_lifetime_fee: "Lifetime Membership",
      premium_fee: "Fee for Premium Names",
      price_per_kbyte: "Price per KByte Transaction Size",
      price_per_output: "Price per recipient",
      symbol3: "Symbols with 3 Characters",
      symbol4: "Symbols with 4 Characters",
    },
    trxTypes: {
      account_create: {
        title: "Create account",
        description: "%(registrarName)s, registered the account , %(userName)s",
      },
      account_role_create: {
        title: "Create account role",
      },
      account_role_delete: {
        title: "Delete account role",
      },
      account_role_update: {
        title: "Update account role",
      },
      account_transfer: {
        title: "Transfer Account",
      },
      account_update: {
        title: "Update account",
        description: "%(user)s, updated account data",
      },
      account_upgrade: {
        title: "Upgrade Account",
        description: "%(user)s, upgraded account to lifetime member",
      },
      account_whitelist: {
        title: "Account whitelist",
        description: "%(issuer)s, %(status)s the account, %(listed)s",
      },
      affiliate_payout: {
        title: "Payout affiliate",
      },
      affiliate_referral_payout: {
        title: "Payout referral affiliate",
      },
      all: {
        title: "Show all",
      },
      assert: {
        title: "Assert operation",
      },
      asset_bid_collateral: {
        title: "Bid collateral",
      },
      asset_claim_fee_pool: {
        title: "Claim fee pool balance",
      },
      asset_claim_fees: {
        title: "Claim asset fees",
      },
      asset_claim_pool: {
        title: "Claim asset fee pool",
        description:
          "%(issuer)s, claimed %(claimed)s %(claimedSymbol)s from %(asset)s fee pool",
      },
      asset_create: {
        title: "Create asset",
        description: "%(issuer)s, created the asset %(symbol)s",
      },
      asset_dividend_distribution: {
        title: "Asset dividend distribution",
      },
      asset_fund_fee_pool: {
        title: "Fund asset fee pool",
        description:
          "%(from)s, funded %(symbol)s fee pool with %(amount)s %(defaultToken)s",
      },
      asset_global_settle: {
        title: "Global asset settlement",
      },
      asset_issue: {
        title: "Issue asset",
        description:
          "%(issuer)s, issued %(assetAmount)s %(symbol)s to , %(receiver)s",
      },
      asset_publish_feed: {
        title: "Publish feed",
      },
      asset_reserve: {
        title: "Burn asset",
      },
      asset_settle: {
        title: "Asset settlement",
      },
      asset_settle_cancel: {
        title: "Cancel asset settlement",
      },
      asset_update: {
        title: "Update asset",
        description: "%(issuer)s, updated asset %(symbol)s",
      },
      asset_update_bitasset: {
        title: "Update SmartCoin",
      },
      asset_update_dividend: {
        title: "Update asset dividend",
      },
      asset_update_feed_producers: {
        title: "Update asset feed producers",
        description:
          "%(issuer)s, updated the feed producers for the asset %(asset)s",
      },
      asset_update_issuer: {
        title: "Update asset owner",
        description:
          "%(issuer)s, transferred rights for %(asset)s to, %(newOwner)s",
      },
      balance_claim: {
        title: "Claim balance",
      },
      bet_adjusted: {
        title: "Adjusted bet",
      },
      bet_cancel: {
        title: "Cancel bet",
      },
      bet_canceled: {
        title: "Canceled bet",
      },
      betting_market_create: {
        title: "Create betting market",
      },
      betting_market_group_cancel: {
        title: "Cancel betting market group",
      },
      betting_market_group_create: {
        title: "Create betting market group",
      },
      betting_market_group_resolve: {
        title: "Resolve betting market group",
      },
      betting_market_group_resolved: {
        title: "Resolved betting market group",
      },
      betting_market_group_update: {
        title: "Update betting market group",
      },
      betting_market_rules_create: {
        title: "Create betting market rules",
      },
      betting_market_rules_update: {
        title: "Update betting market rules",
      },
      betting_market_update: {
        title: "Update betting market",
      },
      bet_matched: {
        title: "Matched bet",
      },
      bet_place: {
        title: "Place bet",
      },
      bid: {
        title: "Bid",
      },
      bid_collateral: {
        title: "Collateral bid",
      },
      blind_transfer: {
        title: "Blinded transfer",
      },
      call_order_update: {
        title: "Update margin",
      },
      cancel_offer: {
        title: "Cancel offer",
      },
      committee_member_create: {
        title: "Create committee member",
      },
      committee_member_update: {
        title: "Update committee member",
      },
      committee_member_update_global_parameters: {
        title: "Global parameters update",
      },
      custom: {
        title: "Custom",
      },
      custom_account_authority_create: {
        title: "Create custom account authority",
      },
      custom_account_authority_delete: {
        title: "Delete custom account authority",
      },
      custom_account_authority_update: {
        title: "Update custom account authority",
      },
      custom_permission_create: {
        title: "Create custom permission",
      },
      custom_permission_delete: {
        title: "Delete custom permission",
      },
      custom_permission_update: {
        title: "Update custom permission",
      },
      event_create: {
        title: "Create event",
      },
      event_group_create: {
        title: "Create event group",
      },
      event_group_delete: {
        title: "Delete event group",
      },
      event_group_update: {
        title: "Update event group",
      },
      event_update: {
        title: "Update event",
      },
      event_update_status: {
        title: "Update event status",
      },
      execute_bid: {
        title: "Execute bid",
      },
      fba_distribute_operation: {
        title: "Fee backed asset distribution",
      },
      fill_order: {
        title: "Fill order",
        description:
          "%(user)s, bought %(paysAmount)s for %(receivesAmmount)s for order #%(id)s",
      },
      finalize_offer: {
        title: "Finalize offer",
      },
      game_move: {
        title: "Game move",
      },
      htlc_create: {
        title: "HTLC create",
      },
      htlc_extend: {
        title: "HTLC extend",
      },
      htlc_redeem: {
        title: "HTLC redeem",
      },
      htlc_redeemed: {
        title: "HTLC redeemed",
      },
      htlc_refund: {
        title: "HTLC refund",
      },
      limit_order_cancel: {
        title: "Cancel order",
        description: "%(user)s, cancelled order #%(id)s",
      },
      limit_order_create: {
        title: "Place order",
        description:
          "%(creator)s, placed order #%(orderId)s to buy %(buyAmount)s for %(sellAmount)s",
      },
      swap_order_create: {
        title: "Swap Order",
      },
      lottery_asset_create: {
        title: "Create lottery asset",
      },
      lottery_end: {
        title: "End lottery",
      },
      lottery_reward: {
        title: "Reward lottery",
      },
      override_transfer: {
        title: "Override transfer",
      },
      nft_approve: {
        title: "Approve nfts",
      },
      nft_metadata_create: {
        title: "Create nft metadata",
      },
      nft_metadata_update: {
        title: "Update nft metadata",
      },
      nft_mint: {
        title: "Mint nft",
      },
      nft_safe_transfer_from: {
        title: "nft safe transfer from",
      },
      nft_set_approval_for_all: {
        title: "Set approval for all nfts",
      },
      offer: {
        title: "Offer",
      },
      proposal_create: {
        title: "Create proposal",
      },
      proposal_delete: {
        title: "Delete proposal",
      },
      proposal_update: {
        title: "Update proposal",
      },
      ticket_create: {
        title: "Create ticket",
      },
      sweeps_vesting_claim: {
        title: "Clain sweeps vesting",
      },
      sidechain_address_add: {
        title: "Add sidechain address",
      },
      sidechain_address_delete: {
        title: "Delete sidechain address",
      },
      sidechain_address_update: {
        title: "Update sidechain address",
      },
      sidechain_transaction_create: {
        title: "Create sidechain transaction",
      },
      sidechain_transaction_send: {
        title: "Send sidechain transaction",
      },
      sidechain_transaction_settle: {
        title: "Settle sidechain transaction",
      },
      sidechain_transaction_sign: {
        title: "Sign sidechain transaction",
      },
      son_create: {
        title: "Create SON",
      },
      son_delete: {
        title: "Delete SON",
      },
      son_heartbeat: {
        title: "Heartbeat SON",
      },
      son_maintenance: {
        title: "SON maintenance",
      },
      son_report_down: {
        title: "Report SON down",
      },
      son_update: {
        title: "Update SON",
      },
      son_wallet_deposit_create: {
        title: "Create deposit SON wallet",
      },
      son_wallet_deposit_process: {
        title: "Process deposit SON wallet",
      },
      son_wallet_recreate: {
        title: "Recreate SON wallet",
      },
      son_wallet_update: {
        title: "Update SON wallet",
      },
      son_wallet_withdraw_create: {
        title: "Create withdraw SON wallet",
      },
      son_wallet_withdraw_process: {
        title: "Process withdraw SON wallet",
      },
      sport_create: {
        title: "Create sport",
      },
      sport_delete: {
        title: "Delete sport",
      },
      sport_update: {
        title: "Update sport",
      },
      ticket_purchase: {
        title: "Purchase ticket",
      },
      tournament_create: {
        title: "Create tournament",
      },
      tournament_join: {
        title: "Join tournament",
      },
      tournament_payout: {
        title: "Payout tournament",
      },
      tournament_leave: {
        title: "Leave tournament",
      },
      transfer: {
        title: "Transfer",
        description: "%(sender)s, send %(amount)s %(symbol)s to , %(receiver)s",
      },
      transfer_from_blind: {
        title: "Transfer from blinded account",
      },
      transfer_to_blind: {
        title: "Transfer to blinded account",
      },
      vesting_balance_create: {
        title: "Create vesting balance",
        description: "%(creator)s, vest %(amount)s %(symbol)s in GPOS",
      },
      vesting_balance_withdraw: {
        title: "Withdraw vesting balance",
        description: "%(owner)s, withdraw %(amount)s %(symbol)s from GPOS",
      },
      withdraw: {
        title: "Withdraw",
      },
      withdraw_permission_claim: {
        title: "Claim withdrawal permission",
      },
      withdraw_permission_create: {
        title: "Create withdrawal permission",
      },
      withdraw_permission_delete: {
        title: "Delete withdrawal permission",
      },
      withdraw_permission_update: {
        title: "Update withdrawal permission",
      },
      witness_create: {
        title: "Create witness",
      },
      witness_update: {
        title: "Update witness",
      },
      witness_withdraw_pay: {
        title: "Witness pay withdrawal",
      },
      worker_create: {
        title: "Create worker",
        description:
          "%(user)s, created a worker proposal with daily pay of %(defaultToken)s",
      },
      credit_offer_create: {
        title: "Create credit offer",
      },
      credit_offer_delete: {
        title: "Delete credit offer",
      },
      credit_offer_update: {
        title: "Update credit offer",
      },
      credit_offer_accept: {
        title: "Accept credit offer",
      },
      credit_deal_repay: {
        title: "Repay credit deal",
      },
    },
  },
  buttons: {
    confirmed: "Confirmed",
    reconfirm_votes: "Reconfirm",
    confirm_votes: "Confirm",
    proxied_account: "Proxied account",
    enter_amount: "Enter an amount",
    swap_coins: "Swap coins",
    login_and_swap_coins: "Login & swap coins",
    logout: "Logout",
    login: "Log in",
    deposit: "Deposit",
    withdraw: "Withdraw",
    swap: "Swap",
    transfer: "Transfer",
    market: "Market",
    generate_bitcoin_address: "Generate Bitcoin addresses",
    login_and_generate_bitcoin_address: "Log in & Generate Bitcoin Addresses",
    add_ethereum_address: "Add Ethereum address",
    update_ethereum_address: "Update Ethereum address",
    login_and_deposit_ethereum: "Log in & Deposit Ethereum",
    dont_have_peerplays_account: "Don't have a Peerplays account? ",
    log_in_withdraw: "Log in & Withdraw %(selectedAsset)s",
    log_in_deposit_hbd_hive: "Log in & Deposit %(assetSymbol)s",
    send: "Send",
    ok: "Ok",
    cancel: "Cancel",
    buy: "Buy",
    sell: "Sell",
    create_account: "Create account",
    save: "Save",
    lets_go: "Let’s Go!",
    buy_membership: "Buy Lifetime Subscription",
    power_up: "Power Up",
    power_down: "Power Down",
    vote: "Vote",
    vest: "Vest",
    reset_changes: "Reset Changes",
    publish_changes: "Publish Changes",
    add: "Add",
    remove: "Remove",
    done: "Done",
    confirm: "Confirm",
    previous: "Previous",
    next: "Next",
    show_only_unread: "Show only unread",
    receive: "Receive",
  },
  connection: {
    automatic_reconnect:
      " After %(reconnect_in_seconds)s seconds a reconnection attempt will be made automatically.",
    manual_reconnect: "Try reconnecting now",
    manual_ping_and_narrow_down: "Narrow down nodes and ping",
    title_out_of_sync: "Connection out of sync",
    out_of_sync:
      "Your connection has been out of sync for %(out_of_sync_seconds)s seconds.",
    want_to_reconnect:
      "If the connection can be recovered this message will disappear automatically.",
  },
  footer: {
    no_connection: "No Blockchain connection",
    nosync: "Your active node is out of sync",
  },
  pages: {
    logout: {
      heading: "Logout",
      title: "You have successfully logged out",
    },
    login: {
      heading: "Log into your account",
      title: "You have successfully logged out",
      dont_have_account: "Don’t have an account? ",
    },
    signUp: {
      heading: "Create your account",
      already_have_account: "Already have a Peerplays account? ",
    },
    dashboard: {
      heading: "Dashboard",
      marketTab: {
        heading: "Choose the trading pair you want to use",
      },
    },
    blocks: {
      heading: "Blocks",
      no_data: "No Data",
      stats_cards: {
        next_vote: "Next Vote Update",
        budget: "Remaining budget (hourly)",
      },
      blockchain: {
        blockchain: "Blockchain",
        heading: "PeerPlays Blockchain",
        current_block_height: "Current Block Height",
        last_irreversible_block: "Last irreversible block",
        supply: "Supply (%(symbol)s)",
        active_witness: "Active Witness",
        confirmation_time: "Confirmation Time",
        search_blocks: "Search Blocks",
        recent_blocks: "Recent Blocks",
        block: "Block",
        next: "Next",
        previous: "Previous",
        transactions: "Transactions",
        block_information: "Block Information",
        witness: "Witness",
      },
      block_details: {
        block_num: "Block Number",
        witness: "Witness",
        transactions: "Transactions",
        block_id: "Block ID",
        merkle_root: "Merkle Root",
        previous_secret: "Previous Secret",
        next_secret: "Next Secret",
        signing_key: "Signing key",
        witness_signature: "Witness Signature",
        search_transactions: "Search Transactions",
      },
      transaction_details: {
        transaction: "Transaction",
        transaction_id: "Transaction ID",
        ref_block_prefix: "Ref block prefix",
        ref_block_num: "Ref block number",
        signatures: "Signatures",
        see_details: "See Details here",
        details: "Details",
        results: "Results",
      },
      assets: {
        heading: "PeerPlays Assets",
        assets: "Assets",
        search_assets: "Search Assets",
      },
      committees: {
        heading: "PeerPlays Committees",
        active_committees: "Active Committees",
        search_committees: "Search Committees",
        committees: "Committees",
      },
      witnesses: {
        heading: "PeerPlays Witnesses",
        active_witnesses: "Active Witnesses",
        block_reward: "Block Reward",
        monthly_earnings: "Monthly Earnings",
        search_witnesses: "Search Witnesses",
        witnesses: "Witnesses",
        current_witness: "Current Witness",
      },
      sons: {
        heading: "PeerPlays Sons",
        active_sons: {
          bitcoin_active_sons: "Bitcoin active sons",
          hive_active_sons: "Hive active sons",
          ethereum_active_sons: "Ethereum active sons",
        },
        search_sons: "Search Sons",
        sons: "Sons",
      },
      fees: {
        heading: "PeerPlays Fees",
        fees: "Fees",
        search_fees: "Search Fees",
        general: "General",
        asset_specific: "Asset Specific",
        market_specific: "Market Specific",
        account_specific: "Account Specific",
        game_specific: "Game Specific",
        business_administration: "Bussiness Administration",
        show_less: "Show Less",
        show_more: "Show More",
      },
    },
    wallet: {
      heading: "Wallet",
      activities: "Activities",
      assets: "Assets",
      send: "Send",
      receive: "Receive",
      back_to_assets: "Back to Assets",
      nfts: "NFTs",
      nft_store: "NFT Store",
      nft_search: "Search NFTs",
      available_assets: "Available assets",
      receive_assets: "Receive assets",
      select_this_asset: "Select this asset",
      select_to_receive: "Select an asset to receive",
      no_btc_address:
        "A Bitcoin address is not yet associated with your account",
      no_eth_address:
        "An Ethereum address is not yet associated with your account",
      receive_selected_asset_instruction:
        "To receive %(assetSymbol)s send funds to , %(account)s, on the Peerplays blockchain",
      send_assets: "Send assets",
      clear_form: "Clear form",
      select_asset: "Select an asset",
      select_blockchain: "Select a blockchain",
      available_to_send: "Available to send:",
      withdraw_alert:
        "If you select a blockchain other than Peerplays, you will be withdrawing your funds to the targeted network.",
    },
    market: {
      heading: "Market",
      select_pair: "Select Pair",
      recent_pairs: "Recent Pairs",
      order_book: "Order Book",
      history: "History",
      my_open_orders: "My Open Orders",
      my_order_history: "My Order History",
      buy: "BUY",
      sell: "SELL",
      orders: "Orders",
      market_depth: "Market depth",
      all_pairs: "All pairs",
      all_statuses: "All statuses",
      completed: "Completed",
      partial: "Partial",
      open: "Open",
      tabs: {
        history: {
          all: "Trade history",
          user: "My history",
        },
        controls: {
          order_form: "Order form",
          limit: "Limit",
          market: "Market",
          advanced: "Advanced",
          time_policy: "Time in force policy",
          time_policy_description:
            "This option sets the rules for how long your order will exist on the order book or how it must execute",
          good_til_canceled: "Good till canceled (default)",
          good_til_time: "Good till time",
          fill_or_kill: "Fill or kill",
          maker_or_cancel: "Maker or cancel",
          immediate_or_cancel: "Immediate or cancel",
          execution: "Execution",
          execution_description:
            "The Post Only option will ensure that your order will not immediately execute against an existing order. Your whole order will be posted to the order book. The Allow Taker option means that all or some of your order can immediately execute against an existing order",
          post_only: "Post only",
          allow_taker: "Allow taker",
          market_fee_description:
            "The owner of %(asset)s charges a market fee of %(percent)s%% for buy orders. This fee will be subtracted from the amount you receive when your order fills, it is not paid when placing an order.",
        },
      },
      twenty_four_hour_high: "24h High",
      twenty_four_hour_low: "24h Low",
      twenty_four_hour_volume: "24h Volume",
      twenty_four_hour_change: "24h Change",
      twenty_four_hour_lowest_ask: "24h Lowest ask",
      twenty_four_hour_highest_bid: "24h Highest bid",
      ask: "Ask",
      bid: "Bid",
    },
    settings: {
      heading: "Settings",
      general: {
        heading: "General",
      },
      key_management: {
        heading: "key Management",
        publickey_title: "Account Public Keys",
        privatekey_title: "Account Private Keys",
        download_link: "Download Generated Keys",
        download_warning:
          "The private keys must be saved securely as it will be shown just once.",
      },
      security: {
        heading: "Security",
      },
      membership: {
        heading: "Membership",
        upgrade_title: "Upgrade for %(feesCashback)s%% Cashback",
        upgraded_title: "You are eligible for %(feesCashback)s%% Cashback",
        upgrade_description:
          "By registering to a Lifetime Membership the account will receive %(feesCashback)s%% cashback on every transaction fee paid. A Lifetime Membership price will change over time, right now it is only %(membershipPrice)s %(defaultToken)s.",
        upgraded_description:
          "Lifetime Membership accounts will receive %(feesCashback)s%% cashback on every transaction fee paid.",
        fee_allocation: "Fee Allocation",
        fee_allocation_description:
          "Every time , %(name)s, pays a transaction fee, that fee is divided among several different accounts. The network takes a %(networkFee)s%% cut, and the Lifetime Member who referred , %(name)s, gets a %(lifetimeFee)s%% cut. The registrar is the account that paid the transaction fee to register , %(name)s, with the network. The registrar gets to decide how to divide the remaining %(referrerTotalFee)s%% between themselves and their own Affiliate Referrer program., %(name)s's, registrar chose to share %(referrerFee)s%% of the total fee with the Affiliate Referrer and keep %(registrarFee)s%% of the total fee for themselves.",
        network: "Network",
        lifetime_reviewer: "Lifetime Referrer",
        registrar: "Registrar",
        affiliate_referrer: "Affiliate Referrer",
        expiration: "Membership Expiration",
        fee_statistics: "Fee Statistics",
        total_fee_paid: "Total Fees Paid",
        pending_fees: "Pending Fees",
        pending_fee_description:
          "Fees paid by , %(name)s, are divided among the network, referrers, and registrars once every maintenance interval %(maintenanceInterval)s seconds). The next maintenance time is %(nextMaintenanceTime)s",
        vesting_fees: "Vesting Fees",
        vesting_description:
          "Most fees are made available immediately, but fees over %(vestingThreshold)s %(defaultToken)s (such as those paid to upgrade your membership or register a premium account name) must vest for a total of %(vestingPeriod)s days.",
      },
    },
    voting: {
      heading: "Voting",
      peerplays_gpos: "PeerPlays (GPOS)",
      peerplays_voting: "PeerPlays Voting",
      lower_case_witnesses: "witnesses",
      lower_case_sons: "sons",
      lower_case_committees: "committees",
      status: {
        approved: "Approved",
        partially_approved: "Partially Approved",
        not_approved: "Not Approved",
        pending_add: "voting to approve",
        pending_remove: "voting to remove approval",
      },
      actions: {
        add: "Add",
        remove: "Remove",
        cancel: "Cancel",
        pending_add: "Pending Add",
        pending_remove: "Pending Remove",
      },
      gpos: {
        heading: "Gamified Proof of Stake (GPOS)",
        tab: "GPOS",
        join_gpos:
          "Join GPOS by transferring your %(defaultToken)s to your GPOS balance.",
        consistently_participate:
          "Consistently participate in voting for the best Witnesses, Advisors, Proposals, and SONs. Share the exciting news and DApps available on Peerplays with others.",
        gpos_description:
          "The more value that comes into Peerplays blockchain through its operations, the more those that participate to help make it secure will earn!",
        rewards_label:
          "If you want to increase your participation rewards you can do it two ways:",
        rewards_way_first:
          "1. Transfer more %(defaultToken)s into your GPOS balance",
        rewards_way_second: "2. Share Peerplays with others",
        decentralized_autonomous_cooperative:
          "Together as a Decentralized Autonomous Cooperative (DAC), we can ensure Peerplays remains the most secure provably fair blockchain globally.",
        gpos_balance: "GPOS Balance",
        voting_performance: "Voting Performance",
        qualified_reward: "Qualified Reward",
        estimated_participation_reward: "Estimated Participation Reward",
        available_balance: "Available Balance:",
        read_less: "Read less",
        read_more: "Read more",
        performance_string: {
          max_rewards: "Max Rewards",
          good_rewards: "Good Rewards",
          great_rewards: "Great Rewards",
          low_rewards: "Low Rewards",
          ok_rewards: "OK Rewards",
          critical_low: "Critical Low",
          lower_rewards: "Lower Rewards",
          no_rewards: "No Rewards",
        },
        powerUp: {
          heading: "GPOS - Power up",
          power_up_description:
            "When you Power Up your %(defaultToken)s on the Peerplays blockchain you are taking your first steps into participating in the Decentralized Autonomous Cooperative (DAC) that is the magic in blockchain tech. This means you will:",
          power_up_description_heading: "Notice",
          power_up_lists: {
            first: "Become a big part of something special on a global scale",
            second: "Earn participation rewards for your efforts",
            third: "Bragging rights to family and friends",
            fourth: "Stake your %(defaultToken)s while you participate",
            fifth: "Help secure the Peerplays blockchain",
          },
        },
        powerDown: {
          heading: "GPOS - Power down",
          power_down_description:
            "When you Power Down it will take 30 days for you to withdraw your %(defaultToken)s balance in full. You will continue to receive participation rewards during that time so long as you have been participating. After Power Down you can then use your %(defaultToken)s like any other cryptocurrency. This means you will:",
          power_down_description_heading: "Notice",
          power_down_lists: {
            first: "Still be a part of something special, just not as much",
            second: "No longer helping secure the Peerplays blockchain",
            third: "No longer earn participation rewards",
            fourth: "Lose bragging rights",
            fifth: "Stop staking your %(defaultToken)s",
          },
        },
      },
      sons: {
        heading: "SONs",
        tab: "Sons",
      },
      witnesses: {
        heading: "Witnesses",
        tab: "Witnesses",
      },
      proxy: {
        heading: "PeerPlays Proxy Voting",
        tab: "Proxy",
      },
      committees: {
        heading: "Committees",
        tab: "Committees",
      },
    },
    user: {
      heading: "All Activity",
      discription: "Profile Page",
    },
    modal: {
      cancel: "Cancel",
      transaction_modal: {
        heading: "Please confirm the transaction",
      },
      password_modal: {
        heading: "Your password or %(neededKeyType)s key is needed",
      },
    },
    peerlink: {
      heading: "PeerLink",
      connect: {
        heading: "Connect",
        connected: "Connected",
        required: "Required",
        connect_metamask: "Connect MetaMask",
        connect_hive: "Connect Hive",
      },
      transfer: {
        heading: "Transfer",
      },
    },
    profile: {
      heading: "Profile",
      my_profile: "My profile",
      orders: "Orders",
      activities: "Activities",
      notifications: "Notifications",
      activity: {
        heading: "Activities",
        my_activity: "My Activity",
        search_activities: "Search Activities",
      },
      orders_tab: {
        heading: "Orders",
        buy: "Buy",
        sell: "Sell",
        partial: "Partial",
        complete: "Complete",
        open_orders: "Open orders",
        order_history: "Order history",
        my_activity: "My activity",
        search_activities: "Search activities",
      },
      notification: {
        heading: "Notifications",
        my_notification: "My notifications",
        search_notifications: "Search notifications",
        read: "Read",
        unread: "Unread",
      },
    },
  },
  links: {
    create_account: "Create account",
    see_all_account_activity: "See all account activity",
    profile: "profile",
    mark_all_read: "Mark all as read",
    pdf: "PDF",
    csv: "CSV",
    learn_more: "Learn More",
  },
  field: {
    options: {
      lock_wallet: "minutes ",
    },
    placeholder: {
      user_name: "Enter username",
      master_password: "Enter master password",
      master_password_private_key: "Master password or private key",
      withdraw_public_key: "Withdrawal public key",
      withdraw_address: "Withdrawal address",
      deposit_address: "Deposit address",
      hive_blockchain_account: "Hive account",
      enter_amount: "Enter amount to send",
      amount: "Amount",
      quantity: "Quantity",
      enter_recipient: "Enter recipient",
      to: "To",
      memo: "Memo",
      price: "Price",
      total: "Total",
      re_enter_master_password: "Re-enter your auto-generated master password",
      confirm_password: "Confirm password",
      opening_balance: "Opening Balance:",
      new_balance: "New Balance:",
      available_balance: "Available Balance:",
      search_accounts: "Search Accounts",
      from: "From",
    },
    labels: {
      blockchain: "Blockchain",
      swap_fee_info:
        "In order to complete swap the following fees is applicable",
      generate_btc_deposit_address:
        "Generate a Bitcoin address so you can deposit BTC to your Peerplays account",
      add_eth_deposit_address:
        "Add an Ethereum address to your Peerplays account and then send ETH from the added address to the `%(primaryWallet)s` address to deposit ETH to your Peerplays account",
      deposit_btc:
        "Deposit your BTC to the Bitcoin address listed above to send it to your Peerplays account",
      bitcoin_associated_account:
        "Your new Bitcoin addresses are now associated with your account",
      ethereum_associated_account:
        "Your new Ethereum addresses are now associated with your account",
      download_private_keys: "Download Private Keys",
      private_keys_warning:
        "The private keys must be saved securely as it will be shown just once during the deposit address creation",
      bitcoin_deposit_address: "Deposit address (BTC address)",
      ethereum_deposit_address: "Deposit address (Ethereum address)",
      sidechain: "Sidechain",
      fetching_price: "Fetching price",
      withdraw_public_key_address: "Compressed Withdraw Public key & Address",
      ethereum_withdrawal_address:
        "Withdrawal Address (Ethereum account address)",
      btc_withdraw_instruction:
        "Withdraw your BTC to the Bitcoin public key and address above or update them.",
      eth_withdraw_instruction:
        "Withdraw your ETH to the Ethereum address above or update it.",
      hive_blockchain_account: "Withdrawal Address (Hive account)",
      hive_withdraw_instruction:
        "Withdraw your %(asset)s to the Hive blockchain account entered above",
      fees_label: "Fees: ",
      total_transaction: "Total Transaction: ",
      withdrawal_confirmation_time: "Confirmation Time: ",
      btc_withdrawal_confirmation_time: "~10 minutes",
      eth_withdrawal_confirmation_time: "~5 minutes",
      hive_withdrawal_confirmation_time: "~3 minutes",
      peerplays_confirmation_time: "~3 seconds",
      estimated_fees_label: "Estimated Fees:",
      fees: "Fees: %(feeAmount)s %(defaultAsset)s",
      market_fee: "Market Fee",
      balance: "Balance",
      auto_generated_password: "Your auto-generated password",
      keep_password_safe: "Keep your password safe to avoid losing any funds. ",
      download_recovery_password: "Download Recovery password file here",
      select_language: "Select Language",
      ui_design: "UI Design",
      allow_transfer_to_my_account: "Allow transfers to my account",
      show_notifications: "Show Notifications",
      select_notifications: "Select notifications",
      faucet: "Faucet",
      faucet_url: "Faucet URL: ",
      copy_url: "Copy URL",
      setting_saved: "Setting Saved",
      lock_wallet: "Lock Wallet",
      select_keys: "Select keys to be generated",
      public_key_owner: "Owner Public Key",
      public_key_active: "Active Public Key",
      public_key_memo: "Memo Public Key",
      private_key: "Private Key",
      generated_key:
        "The %(generatedKeyLabel)s key you requested is as follows:",
      advanced_settings: "Advanced Settings",
      hello: "Hello",
      approved_by: "Approved by %(localStorageAccount)s",
      not_approved_by: "Approved by %(localStorageAccount)s",
      vote_for: "Vote for %(tab)s",
      vote_for_proxy: "Proxy your vote to other accounts",
      not_available: "Not available",
      account_name: "Account name",
      true: "True",
      proxy_voting_account: "Proxy Voting Account",
      no_proxy: "No Proxy",
      fee: "Fee",
      account_to_upgrade: "Account to upgrade",
      upgrade_lifetime: "Upgrade to lifetime member",
      buy_at_least: "Buy at least",
      buy_amount: "Buy amount",
      sell_amount: "Sell amount",
      seller: "seller",
      swapper: "Swapper",
      vesting_amount: "Vesting amount",
      withdrawal_amount: "Withdrawal amount",
      today: "Today",
      yesterday: "yesterday",
      order_to_cancel: "Order to cancel",
      threshold: "Threshold",
      desired_witnesses: "Desired witnesses",
      desired_committees: "Desired committees",
      desired_sons: "Desired sons",
      desired_proxy: "Desired Proxy",
      pending_changes: "Pending changes",
      wallet_lock: "Wallet lock (Minutes)",
      use_whalevault: "Use WhaleVault extension",
      unsaved_changes: "You have unsaved changes to your settings",
      coins_token: "Coins/Tokens",
      open_orders: "Open orders",
      approved: "Approved",
      removed: "Removed",
      my_activity: "My activity",
      available: "Available",
    },
    comments: {
      deposit_hbd:
        "To deposit, %(assetSymbol)s , to , %(accountName)s, please send your funds to , son-account, on the Hive blockchain with the memo , %(accountName)s",
      public_memo: "This memo is public (optional)",
    },
    checkBoxes: {
      cannot_recover_my_lost_password:
        "I understand Peerplays cannot recover my lost password",
      securely_saved_my_password: "I have securely saved my password",
      enable_notifications: "Enable Notifications",
      key_management_group: ["Owner", "Active", "Memo"],
      funds_sent: "funds sent",
      order_created: "order created",
      order_filled: "order filled",
      order_canceled: "order canceled",
      order_expired: "order expired",
      funds_received: "funds received",
      account_upgrade: "account upgrade",
      vesting_balance_create: "vesting balance create",
      vesting_balance_withdraw: "vesting balance withdraw",
      account_updated: "account updated",
    },
    errors: {
      first_select_asset: "Please first select an asset",
      first_select_blockchain: "Please first select a blockchain",
      first_generate_deposit_addresses:
        "Please first generate deposit and withdrawal addresses on the Dashboard Deposit tab",
      first_generate_btc_deposit_addresses:
        "Please first generate Bitcoin addresses on the Dashboard Deposit tab",
      first_generate_eth_deposit_addresses:
        "Please first generate Ethereum addresses on the Dashboard Deposit tab",
      loading_sidechain_accounts: "Please wait for sidechain accounts to load",
      unable_to_create_account:
        "Unable to create an account. Please try again later",
      invalid_bitcoin_public_key:
        "The public key is not valid for Bitcoin %(network)s",
      invalid_ethereum_address: "The address is not valid.",
      enter_amount: "Enter amount",
      insufficient_asset_balance: "Insufficient %(asset)s balance",
      insufficient_balance_for_fee: "Insufficient %(coreAsset)s for fee",
      not_enough_liquidity: "Not enough liquidity",
      sell_amount_should_greater: "Zero sell amount",
      buy_amount_should_greater: "Zero buy amount",
      no_key_for_password: "There is no %(role)s key for this password",
      login_first: "Please login first",
      checking_sons_status: "Please wait for checking the SONs network status",
      user_name_first: "Please provide a valid username first",
      same_account: "Same as your account",
      no_account: "Account not found",
      added_account: "Account is already added",
      user_not_found: "User not found",
      password_incorrect: "Password incorrect",
      username_required: "Username is required",
      username_invalid: "Username is invalid",
      password_required: "Password is required",
      password_should_be_long: "Password should be at least 12 characters long",
      password_not_match: "Password do not match",
      username_taken: "Username Already taken",
      confirmation_required: "Confirmation Required",
      save_your_password: "Please save your password",
      password_white_space: "Password should not contain any white spaces",
      field_is_required: "This field is required",
      server_error: "Server error, please try again later.",
      amount_should_greater: "Amount should be greater than 0",
      amount_should_greater_than: "Amount should be greater than %(amount)s",
      balance_not_enough: "Balance is not enough",
      balance_not_enough_to_pay: "Balance is not enough to pay the fee",
      not_your_account: "Not your Account",
      sons_not_available: "SONs network is not available now",
      first_valid_public_key: "Please provide valid public key",
      not_match_address: "The address is not match with public key",
      from_required: "From is required",
      to_required: "To is required",
      amount_required: "Amount is required",
      withdraw_add_required: "Withdraw address is required",
      invalid_withdraw_hive_address: "Hive withdrawal address is invalid",
      withdraw_pub_key_required: "Withdraw public key is required",
      sons_not_available_try_again:
        "SONs network is not available now. Please try again later!",
      transaction_unable: "Unable to process the transaction!",
      price_should_greater: "Price should be greater than 0",
      quantity_should_greater: "Quantity should be greater than 0",
      total_should_greater: "Total should be greater than 0",
      assets_must_different: "Assets Must Be Different",
      assets_should_be: "One of the assets should be %(defaultToken)s",
      available_balance_cannot_greater:
        "Can not be greater than available balance",
      withdraw_amount_required: "Withdraw amount is required",
      deposit_amount_should_greater: "Deposit amount should be greater than 0",
      deposit_amount_required: "Deposit amount in required",
      memo_warning:
        "WARNING: If you replace the memo key you will be unable to read old memos when logging in with your password",
      select_role: "Please at least select one role",
      wait_loading_keys: "Please wait for loading user keys",
      keys_already_used:
        "These keys are already in used for %(role)s permissions",
      need_to_vest_gpos: "You need to Vest some GPOS balance first",
      asset_required: "Asset is required",
      blockchain_required: "Blockchain is required",
      choose_another_blockchain:
        "Please choose another blockchain for withdrawal",
      cannot_send_yourself: "Can not send to yourself!",
      unable_transaction: "Unable to process the transaction!",

      not_added_to_whalevault: "This account is not added to WhaleVault",
      whalevault_connection_error: "Can not Send Request to whaleVault.",
      whalevault_not_installed:
        "WhaleVault is not installed. Please install WhaleVault extension and reload the app",
      wrong_whalevault_keys: "Added keys to WhaleVault are not correct",
      post_only_limit_order: "Unable to create post only limit order",
      missing_custom_expiration_time:
        "Please select the custom expiration time or change the time policy of the order",
      premium_username:
        "This is a premium name which is not supported by this faucet. A Cheap name includes digits or doesn't include vowels",
      account_creation_errors: {
        account_should: "Account name should ",
        be_longer: "be longer.",
        be_shorter: "be shorter.",
        account_segment_should:
          "Each account segment (separated by `.`) should ",
        start_with_letter: "start with a lowercase letter.",
        have_letters_digits_dashes: "have only letters, digits, or dashes.",
        have_one_dash_in_row: "have only one dash in a row.",
        end_letter_digit: "end with a letter or digit.",
      },
      hive_account_errors: {
        account_should: "Hive account should ",
        be_longer: "be longer.",
        start_with_letter: "start with a lowercase letter.",
        have_letters_digits_dashes: "have only letters, digits, or dashes.",
        end_letter_digit: "end with a letter or digit.",
        have_one_dash_in_row: "have only one dash in a row.",
      },
    },
    success: {
      successfully_transferred:
        "Successfully Transferred %(amount)s %(asset)s to %(to)s",
      successfully_withdraw: "Successfully withdraw",
      successfully_withdrawn:
        "Successfully Withdrawn %(withdrawAmount)s %(symbol)s",
      successfully_deposited:
        "Successfully Deposited %(depositAmount)s %(symbol)s",
      limit_order_successfully: "You have successfully created a limit order",
      swap_order_successfully:
        "Your swap was completed and your received %(buyAmount)s %(buyAssetSymbol)s for %(sellAmount)s %(sellAssetSymbol)s",
      saved_changes: "You have successfuly saved your changes",
      account_upgraded_successfully:
        "Your account successfully upgraded to lifetime membership account",
      published_proxy: "You have successfully published your proxy",
      published_votes: "You have successfully published your votes",
      canceled_limit_order:
        "You have successfully canceled #%(selectedOrderId)s order",
      successfully_generate_btc_addresses:
        "You have successfully generated Bitcoin deposit and withdrawal addresses",
      successfully_generate_eth_addresses:
        "You have successfully generated Ethereum deposit and withdrawal addresses",
    },
  },
  settings: {
    api_closest: "Choose closest automatically",
    connection_error:
      "Unable to connect to API node %(url)s, falling back to known working nodes. Error was: %(error)s",
  },
  tableHead: {
    transaction_hash: "Transaction Hash",
    active_all_chains: "Active",
    votes_all_chains: "Votes",
    status_all_chains: "Status",
    action_all_chains: "Action",
    active_chains: "Active chains",
    account_id: "Account ID",
    block_id: "Block ID",
    time: "Time",
    witness: "Witness",
    transaction: "Transaction",
    asset: "Asset",
    quote_asset: "Quote asset",
    available: "Available",
    change: "Change (24 hrs)",
    price: "Price",
    volume: "Volume",
    current_price: "Current Price",
    market_change: "Change",
    type: "Type",
    info: "Info",
    id: "ID",
    fee: "Fee",
    expiration: "Expiration",
    date: "Date",
    symbol: "Symbol",
    max_supply: "Max Supply",
    precision: "Precision",
    issuer: "Issuer",
    rank: "Rank",
    name: "Name",
    total_votes: "Total Votes",
    url: "Url",
    operation: "Operation",
    operations: "Operations",
    fee_type: "Fee Type",
    standard_fee: "Standard Fee",
    last_block: "Last Block",
    missed_blocks: "Missed Blocks",
    website: "Website",
    action: "Action",
    votes: "Votes",
    category: "Category",
    active: "Active",
    key: "key",
    actions: "Actions",
    in_orders: "In orders",
    ref_block_prefix: "Ref block prefix",
    ref_block_num: "Ref block #",
    extensions: "Extensions",
    status: "Status",
    img: "Image",
    maker: "Maker",
    collection: "Collection",
    best_offer: "Best offer",
    quantity: "Quantity",
    on_sale: "On sale",
    number: "#",
    operation_id: "Operation ID",
    operation_type: "Operation Type",
    fees: "Fees",
    pair: "Pair",
    side: "Side",
    amount: "Amount",
    filled: "Filled",
    total: "Total",
    status_actions: "Status/Actions",
    sidechain: "Sidechain",
    active_on: "Active on",
    total_votes_on: "Total votes on",
    status_on: "Status on",
  },
  tableFilters: {
    active: "Active",
    inactive: "Inactive",
    approved: "Approved",
    not_approved: "Not Approved",
    add: "Add",
    remove: "Remove",
    pending_add: "Pending Add",
    pending_remove: "Pending Remove",
    not_for_sale: "Not for sale",
    on_sale: "On sale",
  },
  tooltips: {
    copy: "copy",
    copied: "copied",
    mark_read: "mark as read",
    mark_unread: "mark as unread",
    swap_transaction_type: "Transaction Type : Swap",
    proxied_account: "You have proxied your voting power",
    zero_votes: "You haven't approved any members",
  },
  file_content: {
    btc_withdraw_account: "Bitcoin Withdraw Account",
    btc_deposit_account: "Bitcoin Deposit Account",
    btc_deposit_account_description:
      "Used to create the above PeerPlays multi-signature deposit address",
    peerplays_btc_deposit_address: "PeerPlays Deposit Address",
    eth_withdraw_account: "Ethereum Withdraw Account",
    eth_deposit_account: "Ethereum Deposit Account",
  },
  transfer: {
    transfer: "Transfer",
    network: "Network",
    token: "Token",
    from: "From",
    to: "To",
    max: "Max",
    available: "Available",
    estimated_transfer_fees: "Estimated transfer fees",
    approx_value: "Approx. Value",
    error_message: "Display error message here if any",
    see_full_transfer_history: "See full transfer history",
  },
};
