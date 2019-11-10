export interface IMetaShare {
  encryptedShare: string;
  meta: {
    version: number;
    validator: string;
    index: number;
    walletId: string;
    tag: string;
    timestamp: string;
  };
  encryptedStaticNonPMDD: string;
}

export interface IDynamicNonPMDD {
  updatedAt: number;
  encryptedDynamicNonPMDD: string;
}

export interface ISocialStaticNonPMDD {
  secondaryXpub: string;
  bhXpub: string;
}

export interface IBuddyStaticNonPMDD {
  secondaryMnemonic: string;
  twoFASecret: string;
  secondaryXpub: string;
  bhXpub: string;
}
