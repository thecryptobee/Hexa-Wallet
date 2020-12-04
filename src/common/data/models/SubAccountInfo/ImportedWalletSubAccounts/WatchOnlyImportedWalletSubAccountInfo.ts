import {
  Balances,
  TransactionDetails,
} from '../../../../../bitcoin/utilities/Interface';
import AccountVisibility from '../../../enums/AccountVisibility';
import SourceAccountKind from '../../../enums/SourceAccountKind';
import SubAccountKind from '../../../enums/SubAccountKind';
import UTXOCompatibilityGroup from '../../../enums/UTXOCompatibilityGroup';
import {
  ImportedWalletSubAccountDescribing,
  SubAccountDescribingConstructorProps,
} from '../Interfaces';

type ConstructorProps = SubAccountDescribingConstructorProps & {};

export default class WatchOnlyImportedWalletSubAccountInfo
  implements ImportedWalletSubAccountDescribing {
  id: string | null;
  accountShellID: string | null;
  instanceNumber: number;

  kind: SubAccountKind = SubAccountKind.WATCH_ONLY_IMPORTED_WALLET;
  sourceKind: SourceAccountKind;

  balances: Balances;

  visibility: AccountVisibility;
  isTFAEnabled: boolean;

  defaultTitle: string;
  defaultDescription: string = 'View a non-Hexa wallet as an account.';
  customDisplayName: string | null;
  customDescription: string | null;

  avatarImageSource = require('../../../../../assets/images/icons/icon_import_watch_only_wallet.png');

  transactions: TransactionDetails[];
  utxoCompatibilityGroup: UTXOCompatibilityGroup =
    UTXOCompatibilityGroup.SINGLE_SIG_PUBLIC;

  constructor({
    id = null,
    accountShellID = null,
    instanceNumber,
    defaultTitle = 'Watch-Only',
    balances = { confirmed: 0, unconfirmed: 0 },
    customDisplayName = null,
    customDescription = null,
    visibility = AccountVisibility.DEFAULT,
    isTFAEnabled = false,
    transactions = [],
  }: ConstructorProps) {
    this.id = id;
    this.accountShellID = accountShellID;
    this.instanceNumber = instanceNumber;
    this.defaultTitle = defaultTitle;
    this.balances = balances;
    this.customDisplayName = customDisplayName;
    this.customDescription = customDescription;
    this.visibility = visibility;
    this.isTFAEnabled = isTFAEnabled;
    this.transactions = transactions;
  }
}
