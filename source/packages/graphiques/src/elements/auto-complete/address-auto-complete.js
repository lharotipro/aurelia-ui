import { inject, Factory, bindable, bindingMode, NewInstance } from 'aurelia-framework';

// eslint-disable-next-line no-unused-vars
import { Adresse } from '../../models/adresse';
import { HttpClient } from 'aurelia-fetch-client';
import { AureliaConfiguration } from 'aurelia-configuration';
import { AutoCompleteController } from './auto-complete-controller';

/** @type {Record<string, als.AddressAutoCompleteControllerConfiguration<Adresse>>} */
const options = {
  zipCode: {
    requestFactory: fonction => texte => fonction(texte, 'municipality', 5),
    buildItemModel: item => {
      if (!item) return;
      const firstLine = item.commune && item.codePostal ? `${item.commune} (${item.codePostal})` : undefined;
      return Object.assign(item, { firstLine });
    }
  },
  address: {
    requestFactory: fonction => texte =>
      fonction(texte, 'housenumber', 5).then(result => result.filter(a => a.numero)),
    buildItemModel: item => {
      if (!item) return;
      const firstLine =
        item.numero && item.nomVoie && item.codePostal && item.commune
          ? `${item.numero} ${item.nomVoie} ${item.codePostal} ${item.commune}`
          : undefined;
      return Object.assign(item, { firstLine });
    }
  }
};

@inject(AureliaConfiguration, Factory.of(HttpClient), NewInstance.of(AutoCompleteController))
export class AddressAutoComplete {
  /** @type {als.AddressMode} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  mode = 'address';

  /** @type {Adresse} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** @type {Boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** @type {HttpClient} */ _client;
  /** @type {AutoCompleteController<Adresse>} */ addressAutoCompleteController;

  /**
   * @param {AureliaConfiguration} configuration
   * @param {als.HttpClientFactory} createHttpClient
   * @param {AutoCompleteController} controller
   */
  constructor(configuration, createHttpClient, controller) {
    this._client = createHttpClient();
    const url = configuration.get('api.address');
    this._client.configure(httpClientConfiguration =>
      httpClientConfiguration.withBaseUrl(url).withDefaults({ headers: { Accept: 'application/json' } })
    );
    this.addressAutoCompleteController = controller;
    this.setMode();
  }

  modeChanged() {
    this.setMode();
  }

  setMode() {
    const { requestFactory, buildItemModel } = options[this.mode];
    const search = requestFactory(this.searchAdresse.bind(this));
    this.addressAutoCompleteController.configure(search, buildItemModel);
  }

  /**
   * @param {string} query
   * @param {string} type
   * @param {number} limit
   * @param {string} postcode
   * @param {string} cityCode
   * @returns
   */
  async searchAdresse(query, type, limit, postcode, cityCode) {
    let url = '/search/?q=' + query;
    if (type) url = url + '&type=' + type;
    if (limit) url = url + '&limit=' + limit;
    if (postcode) url = url + '&postcode=' + postcode;
    if (cityCode) url = url + '&citycode=' + cityCode;
    url = encodeURI(url);
    if (!this._client) return;
    /** @type {ext.FeatureCollection} */
    const result = await this._client.fetch(url).then(response => response.json());
    return result.features.map(feature => {
      /** @type {ext.GouvFrAddress} */
      // @ts-ignore
      const gouvFrAddress = feature.properties;
      // @ts-ignore
      return Adresse.fromObject({
        banId: gouvFrAddress.id,
        numero: gouvFrAddress.housenumber,
        nomVoie: gouvFrAddress.street,
        codeInsee: gouvFrAddress.citycode,
        codePostal: gouvFrAddress.postcode,
        codeCommune: gouvFrAddress.citycode,
        commune: gouvFrAddress.city,
        oldCommune: gouvFrAddress.oldcity,
        context: gouvFrAddress.context,
        label: gouvFrAddress.label
      });
    });
  }
}
