const ALLOWED_PROTOCOLS = ["https://", "http://"];

export const couldBeValidProtocol = incompleteURL => {
  return ALLOWED_PROTOCOLS.some(protocol => {
    return protocol.startsWith(incompleteURL);
  });
};

export const hasAllowedProtocol = url => {
  return ALLOWED_PROTOCOLS.some(protocol => {
    return url.startsWith(protocol);
  });
};

/* eslint-disable no-useless-escape */
// borrowed from http://urlregex.com/
const urlValid = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

// FIXME: remove forDisplay & implement couldBeValidUrl
export const validateUrl = (str, forDisplay = false) => {
  if (forDisplay) {
    if (str.length === 0) return true;
    if (couldBeValidProtocol(str)) {
      return true;
    }
  }

  if (hasAllowedProtocol(str) && urlValid.test(str)) return true;
  return false;
};

// borrowed from https://richjenks.com/filename-regex/
const filenameValid = /^(?!.{256,})(?!(aux|clock\$|con|nul|prn|com[1-9]|lpt[1-9])(?:$|\.))[^ ][ \.\w-$()+=[\];#@~,&amp;']+[^\. ]$/i;

export const validateFilename = filename => {
  // we don't want to tweak filenameValid, so
  // we will check to see if any /'s are in this filename.
  return filenameValid.test(filename) && !filename.includes("/");
};

const couldBeValidBelowFourCharacters = /[A-Za-z0-9\-_.$]*/;

export const couldBeValidFilename = filename => {
  // this is to be used for display purposes only.
  // The motivation is we don't want to make an input element red
  // because the user types a single possibly-valid character, which is
  // forbidden in some systems.
  return filename.length > 3
    ? validateFilename(filename)
    : couldBeValidBelowFourCharacters.test(filename) && !filename.includes("/");
};

/* eslint-enable no-useless-escape */
