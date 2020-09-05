interface String {
  title(): string;
}

String.prototype.title = function (): string {
  return this.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
