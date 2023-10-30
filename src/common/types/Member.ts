import { CommitteeMember, SonAccount, WitnessAccount } from ".";

export type Member = WitnessAccount | SonAccount | CommitteeMember;

export type MemberType = "witnesses" | "sons" | "committees";

export function isSonAccount(member: Member): member is SonAccount {
  return (member as SonAccount).sidechain_public_keys !== undefined;
}
