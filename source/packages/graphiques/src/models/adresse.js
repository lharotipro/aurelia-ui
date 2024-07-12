import { ValidationRules } from 'aurelia-validation';
import { fromObject } from '../core/decorators';

@fromObject
export class Adresse {
  /**
   * @param {string} id
   * @param {string} banId
   * @param {string} paysCode
   * @param {string} numero
   * @param {string} nomVoie
   * @param {string} codeInsee
   * @param {string} codePostal
   * @param {string} commune
   * @param {string} oldCommune
   * @param {string} context
   * @param {string} label
   * @param {string} complementAdresse
   * @param {string} codeCommune
   */
  constructor(
    id,
    banId,
    paysCode,
    numero,
    nomVoie,
    codeInsee,
    codePostal,
    commune,
    context,
    label,
    complementAdresse,
    codeCommune,
    oldCommune
  ) {
    this.id = id;
    this.banId = banId;
    this.paysCode = paysCode ?? 'FRA';
    this.numero = numero;
    this.nomVoie = nomVoie;
    this.codeInsee = codeInsee;
    this.codePostal = codePostal;
    this.commune = commune;
    this.context = context;
    this.complementAdresse = complementAdresse;
    this.label = label;
    this.codeCommune = codeCommune;
    this.oldCommune = oldCommune;
  }
}

ValidationRules.ensure('numero')
  .required()
  .maxLength(8)

  .ensure('nomVoie')
  .required()
  .maxLength(100)

  .ensure('codePostal')
  .required()
  .maxLength(10)

  .ensure('commune')
  .required()
  .maxLength(100)

  .ensure('complementAdresse')
  .maxLength(100)

  .ensure('paysCode')
  .required()

  .on(Adresse);
