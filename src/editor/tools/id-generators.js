export function IdFactory() {
  this.state = 0;
  this.nextId = () => {
    this.state += 1;
    return this.state;
  };
  this.resetIdForTestingPurposesOnly = () => {
    this.state = 0;
  };
}

export const historyIdGen = new IdFactory();
