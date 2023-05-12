import { go } from 'fuzzysort';

export class FuzzySearch {
  private readonly data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  public search(query: string, limit: number = 10) {
    return go(query, this.data, { limit: limit });
  }
}
