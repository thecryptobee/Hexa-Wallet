import { v4 as uuid } from 'uuid';
import SubAccountKind from '../../enums/SubAccountKind';
import {
  DonationSubAccountDescribing,
  SubAccountDescribingConstructorProps,
} from './Interfaces';
import UTXOCompatibilityGroup from '../../enums/UTXOCompatibilityGroup';
import AccountVisibility from '../../enums/AccountVisibility';
import {
  Balances,
  TransactionDetails,
} from '../../../../bitcoin/utilities/Interface';
import SourceAccountKind from '../../enums/SourceAccountKind';

type ConstructorProps = SubAccountDescribingConstructorProps & {
  doneeName: string;
  causeName: string;
};

export default class DonationSubAccountInfo
  implements DonationSubAccountDescribing {
  id: string;
  accountShellID: string | null;
  instanceNumber: number;

  kind: SubAccountKind = SubAccountKind.DONATION_ACCOUNT;
  balances: Balances;
  sourceKind: SourceAccountKind;

  visibility: AccountVisibility;
  isTFAEnabled: boolean;

  defaultTitle: string;
  defaultDescription: string = 'Directly Accept Donations';
  customDisplayName: string | null;
  customDescription: string | null;

  doneeName: string;
  causeName: string;

  avatarImageSource = require('../../../../assets/images/icons/icon_donation_hexa.png');

  transactions: TransactionDetails[];

  /**
   * Can either be `SINGLE_SIG_PUBLIC` or `MULTI_SIG_PUBLIC`,
   * depending on what the user chooses during creation.
   */
  utxoCompatibilityGroup: UTXOCompatibilityGroup;

  constructor({
    id = uuid(),
    accountShellID = null,
    instanceNumber,
    defaultTitle = 'Donation Account',
    balances = { confirmed: 0, unconfirmed: 0 },
    customDisplayName = null,
    customDescription = null,
    doneeName,
    causeName,
    visibility = AccountVisibility.DEFAULT,
    isTFAEnabled = false,
    transactions = [],
    utxoCompatibilityGroup = UTXOCompatibilityGroup.MULTI_SIG_PUBLIC,
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
    this.sourceKind = isTFAEnabled
      ? SourceAccountKind.SECURE_ACCOUNT
      : SourceAccountKind.REGULAR_ACCOUNT;
    this.doneeName = doneeName;
    this.causeName = causeName;
    this.transactions = transactions;
    this.utxoCompatibilityGroup = utxoCompatibilityGroup;
  }
}
