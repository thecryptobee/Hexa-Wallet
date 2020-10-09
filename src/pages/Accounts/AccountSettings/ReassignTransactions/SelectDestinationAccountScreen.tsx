import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useDispatch } from "react-redux";
import ButtonStyles from '../../../../common/Styles/Buttons';
import ListStyles from '../../../../common/Styles/Lists';
import DestinationAccountsList from '../../../../components/account-settings/transaction-reassignment/DestinationAccountsList';
import useAccountShellFromNavigation from '../../../../utils/hooks/state-selectors/accounts/UseAccountShellFromNavigation';
import AccountShell from '../../../../common/data/models/AccountShell';
import { reassignTransactions } from '../../../../store/actions/accounts';
import { resetStackToAccountDetails } from '../../../../navigation/actions/NavigationActions';
import useCompatibleDestinationAccounts from '../../../../utils/hooks/state-selectors/accounts/UseCompatibleDestinationAccounts';

export type Props = {
  navigation: any;
};

const HeaderSection: React.FC = () => {
  return (
    <View style={ListStyles.infoHeaderSection}>
      <Text style={ListStyles.infoHeaderText}>Choose a destination.</Text>
    </View>
  );
}

const ReassignTransactionsSelectDestinationAccountScreen: React.FC<Props> = ({
  navigation,
}: Props) => {
  const dispatch = useDispatch();

  const currentAccountShell = useAccountShellFromNavigation(navigation);
  const selectableAccountShells = useCompatibleDestinationAccounts(currentAccountShell);
  const [selectedAccountShellID, setSelectedAccountShellID] = useState<string>(null);

  const selectedTransactionIDs = useMemo(() => {
    return navigation.getParam('selectedTransactionIDs', []);
  }, [navigation]);

  const canProceed = useMemo(() => {
    return selectedAccountShellID != null;
  }, [selectedAccountShellID]);

  function handleAccountSelection(accountShell: AccountShell) {
    setSelectedAccountShellID(accountShell.id);
  }

  function handleProceedButtonPress() {
    dispatch(reassignTransactions({
      transactionIDs: selectedTransactionIDs,
      sourceID: currentAccountShell.id,
      destinationID: selectedAccountShellID,
    }));

    navigation.dispatch(resetStackToAccountDetails({
      accountID: currentAccountShell.id
    }));
  }

  return (
    <View style={styles.rootContainer}>
      <HeaderSection />

      <View>
        <DestinationAccountsList
          selectableAccountShells={selectableAccountShells}
          selectedAccountShellID={selectedAccountShellID}
          onAccountSelected={handleAccountSelection}
        />
      </View>

      <View style={styles.proceedButtonContainer}>
        <Button
          raised
          buttonStyle={ButtonStyles.primaryActionButton}
          title="Confirm & Proceed"
          titleStyle={ButtonStyles.actionButtonText}
          onPress={handleProceedButtonPress}
          disabled={canProceed === false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  proceedButtonContainer: {
    zIndex: 2,
    elevation: 2,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});

export default ReassignTransactionsSelectDestinationAccountScreen;
