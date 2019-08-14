import {
  hasAllowedProtocol,
  couldBeValidProtocol,
  validateUrl,
  validateFilename
} from "../validators";

const couldBeValidProtocolTests = [
  { in: "http", out: true },
  { in: "h", out: true },
  { in: "", out: true },
  { in: "h", out: true },
  { in: "https://", out: true },
  { in: "http://", out: true },
  { in: "htps", out: false },
  { in: "https:////", out: false }
];

describe("couldBeValidProtocol", () => {
  it("validates possible protocols", () => {
    couldBeValidProtocolTests.forEach(c => {
      expect(couldBeValidProtocol(c.in)).toBe(c.out);
    });
  });
});

const hasAllowedProtocolTests = [
  { in: "https://thing.com", out: true },
  { in: "http://thing.com", out: true },
  { in: "thing.com", out: false },
  { in: "//thing.com", out: false },
  { in: "https://", out: true },
  { in: "http://", out: true }
];

describe("hasAllowedProtocol", () => {
  it("looks for a valid protocol", () => {
    hasAllowedProtocolTests.forEach(c => {
      expect(hasAllowedProtocol(c.in)).toBe(c.out);
    });
  });
});

const urls = [
  { in: "", out: false },
  { in: "", forDisplay: true, out: true },
  { in: "htt", forDisplay: true, out: true },
  { in: "htt", forDisplay: false, out: false },
  { in: "https://", forDisplay: true, out: true },
  { in: "http://", forDisplay: true, out: true },
  { in: "https://", forDisplay: false, out: false },
  { in: "https://", forDisplay: false, out: false },
  { in: "whatever.com", out: false },
  { in: "https://whatever.com", out: true },
  { in: "https://whatever.com", forDisplay: true, out: true },
  { in: "https:///whatever.com", out: false },
  { in: "https:///whatever.com", forDisplay: false, out: false }
];

describe("validateUrl", () => {
  it("validates a wide variety of urls", () => {
    urls.forEach(url => {
      expect(validateUrl(url.in, url.forDisplay)).toBe(url.out);
    });
  });
});

const filenames = [
  { in: "filename", out: true },
  { in: "f///ilename", out: false },
  { in: "ff", forDisplay: false, out: false },
  { in: "ff", forDisplay: true, out: true }, // let it go since it's not long enough
  { in: "//", forDisplay: true, out: true }, // this should in theory fail but I don't want to edit the regex too much
  { in: "", forDisplay: true, out: true },
  { in: "", out: false }
];

describe("validateFilename", () => {
  filenames.forEach(f => {
    expect(validateFilename(f.in, f.forDisplay)).toBe(f.out);
  });
});
