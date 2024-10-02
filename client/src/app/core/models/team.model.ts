export class Team {
  id: number;
  name: string;
  description: string;
  code: string;

  constructor(id: number, name: string, description: string, code: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.code = code;
  }

  // A method to get a summary of the team
  getSummary(): string {
    return `${this.name}: ${this.description}, ${this.code}`;
  }
}
