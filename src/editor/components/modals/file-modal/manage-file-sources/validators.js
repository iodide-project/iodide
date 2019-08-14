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

export const validateFilename = (filename, forDisplay = false) => {
  if (forDisplay && filename.length <= 2) return true;
  return filenameValid.test(filename);
};

/* eslint-enable no-useless-escape */
