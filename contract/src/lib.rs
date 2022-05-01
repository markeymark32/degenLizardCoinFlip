use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{env, near_bindgen, Promise, AccountId};

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct CoinFlip {
    fees: f64,
    chance: f64,
    fee_wallet: String,
    team_wallet: String,
    history: Vector<(u64, u128, bool, AccountId)>,
}

impl Default for CoinFlip {
    fn default() -> Self {
        Self {
            fees: 0.035,
            chance: 0.5,
            fee_wallet: "fees.ragingrhinos.aslabs.testnet".to_owned(),
            team_wallet: "team.ragingrhinos.aslabs.testnet".to_owned(),
            history: Vector::new(b"history".to_vec()),
        }
    }
}

#[near_bindgen]
impl CoinFlip {
    pub fn get_fees(&self) -> f64 {
        return self.fees;
    }

    pub fn get_chance(&self) -> f64 {
        return self.chance;
    }

    pub fn get_fee_wallet(&self) -> String {
        return self.fee_wallet.clone();
    }

    pub fn get_team_wallet(&self) -> String {
        return self.team_wallet.clone();
    }

    #[payable]
    pub fn play(&mut self, bet_value: String) -> bool {
        env::log(format!("Received {}", env::attached_deposit().to_string()).as_bytes());

        if bet_value != "heads" && bet_value != "tails" {
            env::panic(b"Please choose 'heads' or 'tails'.");
        }

        if env::attached_deposit() < (500_000_000_000_000_000_000_000 + 500_000_000_000_000_000_000 * ((self.fees * 1000.0) as u128)) {
            env::panic(b"You need to deposit at least 0.5 NEAR + 0.0175 NEAR fee to play.");
        }

        let mut amount: u128 = env::attached_deposit() * 1000 / 1035;
        let max_bet = 5_000_000_000_000_000_000_000_000;

        if amount > max_bet {
            amount = max_bet;
        }

        env::log(format!("Wagering : {}", amount.to_string()).as_bytes());

        env::log(format!("Paying {} in fees", amount * 35 / 1000).as_bytes());
        env::log(format!("Sending back {} since unused", env::attached_deposit() - amount - ((amount / 1000) * ((self.fees * 1000.0) as u128))).as_bytes());

        Promise::new(env::predecessor_account_id()).transfer(env::attached_deposit() - amount - ((amount / 1000) * ((self.fees * 1000.0) as u128)));
        Promise::new(self.fee_wallet.clone()).transfer(amount * 3 / 100);
        Promise::new(self.team_wallet.clone()).transfer(amount / 400);

        let rnd = *env::random_seed().get(0).unwrap();

        env::log(format!("roll : {}", rnd.to_string()).as_bytes());

        let won;

        if bet_value == "heads" {
            won = (rnd as f64) < (u8::MAX as f64) * self.chance;
        } else {
            won = (rnd as f64) > (u8::MAX as f64) * self.chance;
        }

        self.history.push(&(env::block_timestamp(), amount, won, env::predecessor_account_id()));

        if won {
            env::log("You won!".as_bytes());
            Promise::new(env::predecessor_account_id()).transfer(amount * 2);
            return true;
        }
        env::log("You lost!".as_bytes());

        return false;
    }

    pub fn get_last_bets(&self, num: u64) -> Vec<(u64, u128, bool, AccountId)> {
        let mut vec: Vec<(u64, u128, bool, AccountId)> = Vec::new();

        let start = self.history.len().checked_sub(num).unwrap_or(0);
        let end = self.history.len();
        for i in start..end {
            vec.push(self.history.get(i).unwrap());
        }

        vec
    }
}

/*
 * the rest of this file sets up unit tests
 * to run these, the command will be:
 * cargo test --package raging_rhinos_coin_flip_game -- --nocapture
 * Note: 'raging_rhinos_coin_flip_game' comes from cargo.toml's 'name' key
 */
#[cfg(test)]
mod tests {

    use super::*;
    use near_sdk::json_types::ValidAccountId;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env};

    fn get_context(predecessor_account_id: ValidAccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id)
            .account_balance(10_000_000_000_000_000_000_000_000)
            .random_seed(vec![0, 1, 2]);
        builder
    }

    #[test]
    fn play_validate_result() {
        // set up the mock context into the testing environment
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());

        let result = contract.play("heads".to_string());

        println!("Result of playing: {}", result);

        println!("Fees: {}", contract.get_fees());

        assert_eq!(result, true);
    }

    #[test]
    fn validate_view_methods() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let contract = CoinFlip::default();

        testing_env!(context.is_view(true).build());

        assert_eq!(0.035, contract.get_fees());
        assert_eq!(0.5, contract.get_chance());
        assert_eq!("fees.ragingrhinos.aslabs.testnet".to_owned(), contract.get_fee_wallet());
        assert_eq!("team.ragingrhinos.aslabs.testnet".to_owned(),contract.get_team_wallet());
    }

    #[test]
    #[should_panic(expected = "You need to deposit at least 0.5 NEAR + 0.0175 NEAR fee to play.")]
    fn play_less_than_minimal_bid() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .is_view(false)
            .attached_deposit(500_000_000_000_000_000_000_000)
            .build());

        contract.play("heads".to_string());
    }

    #[test]
    fn play_bet_exactly_minimum() {
        // set up the mock context into the testing environment
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .is_view(false)
            .attached_deposit(517_500_000_000_000_000_000_000)
            .build());

        let result = contract.play("heads".to_string());

        println!("Result of playing: {}", result);

        println!("Fees: {}", contract.get_fees());

        assert_eq!(result, true);
    }

    #[test]
    fn play_multiple_expected_results() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();
        
        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .random_seed(vec![0])
            .build());

        assert_eq!(contract.play("heads".to_string()), true);
        
        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .random_seed(vec![128])
            .build());

        assert_eq!(contract.play("heads".to_string()), false);

        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .random_seed(vec![255])
            .build());

        assert_eq!(contract.play("tails".to_string()), true);
        
        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .random_seed(vec![0])
            .build());

        assert_eq!(contract.play("tails".to_string()), false);
    }

    #[test]
    #[should_panic(expected = "Please choose 'heads' or 'tails'.")]
    fn bet_value_must_be_heads_or_tails() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = CoinFlip::default();

        testing_env!(context
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());
        contract.play("foo".to_string());
    }

    #[test]
    fn get_last_bets_returns_last_bet(){
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .random_seed(vec![0])
            .current_account_id(accounts(1))
            .is_view(false)
            .block_timestamp(100)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());

        contract.play("heads".to_string());

        let results = contract.get_last_bets(1);

        assert_eq!(results.len(), 1);

        let (block_timestamp, amount, won, account_id) = results.get(0).unwrap();
        assert_eq!(*block_timestamp, 100);
        assert_eq!(*amount, 1_000_000_000_000_000_000_000_000);
        assert_eq!(*won, true);
        assert_eq!(*account_id, accounts(1).to_string());
    }

    #[test]
    fn get_last_bets_returns_correct_number_of_bets(){
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .random_seed(vec![0])
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());

        contract.play("heads".to_string());
        contract.play("tails".to_string());
        contract.play("heads".to_string());

        let results = contract.get_last_bets(2);

        assert_eq!(results.len(), 2);

        assert_eq!(results.get(0).unwrap().2, false);
        assert_eq!(results.get(1).unwrap().2, true);
    }

    #[test]
    fn get_last_bet_handles_more_requested_than_played(){
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = CoinFlip::default();

        testing_env!(context
            .random_seed(vec![0])
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());

        contract.play("heads".to_string());

        let results = contract.get_last_bets(10);

        assert_eq!(results.len(), 1);
    }

    #[test]
    fn get_last_bet_handles_no_history(){
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let contract = CoinFlip::default();

        testing_env!(context
            .random_seed(vec![0])
            .is_view(false)
            .attached_deposit(1_035_000_000_000_000_000_000_000)
            .build());

        let results = contract.get_last_bets(10);

        assert_eq!(results.len(), 0);
    }
}
