export class Page {
  query: any;
  public constructor(query: any) {
    this.query = query;
  }

  public async getPage(
    page: number = 1,
    pageSize: number = 10
  ): Promise<any[]> {
    const cursor = this.query
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Convert the cursor to an array
    const results = await cursor;

    // Return the results
    return results;
  }

  get length() {
    return this.query.length;
  }
}
