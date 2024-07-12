/** @template T,U */
export class AutoCompleteController {
  /**
   * @param {als.Search<T>} search
   * @param {als.ItemModelBuilder<T,U>} buildItemModel
   */
  configure(search, buildItemModel = item => item) {
    this._search = search;
    this._buildItemModel = buildItemModel;
  }

  /**
   * @param {string} searchText
   * @returns {Promise<(T | U)[]>}
   */
  async search(searchText) {
    if (!searchText) return [];
    const results = await this._search(searchText);
    return results.map(item => this._buildItemModel(item)) || [];
  }

  /**
   * @param {T} item
   * @returns {T | U}
   */
  buildItemModel(item) {
    if (!this._buildItemModel) return;
    return this._buildItemModel(item);
  }
}
