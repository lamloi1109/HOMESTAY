import { domainToASCII, domainToUnicode } from 'node:url';
import validator from 'validator';
import { z } from 'zod';

// EmailStr retained Unicode local parts, NFC and Unicode IDNA domains. Lowercase
// the entire address only for account lookup; booking guest names retain case.
export const emailAddress = z.string().transform(value => {
  const displayAddress = value.match(/^[^<>]*<([^<>]+)>$/);
  const address = (displayAddress?.[1] ?? value).trim().normalize('NFC');
  const at = address.lastIndexOf('@');
  if (at < 0) return address;
  const domain = domainToASCII(address.slice(at + 1));
  return `${address.slice(0, at)}@${domainToUnicode(domain).toLowerCase()}`;
}).pipe(z.string().max(320).refine(value => !value.startsWith('"') && validator.isEmail(value, {
  allow_utf8_local_part: true,
  allow_ip_domain: false,
}), 'Invalid email address'));
