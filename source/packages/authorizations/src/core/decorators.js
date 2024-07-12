import { Container } from "aurelia-dependency-injection";

/**
 * Ajoute une méthode statique fromObject sur la classe décorée permettant la
 * création d'une instance de cette classe avec les propriétés des objets passés en paramètre.
 * @type { ClassDecorator }
 * @example
 * \@fromObject
 * export class Section {}
 * ...
 * let section = Section.fromObject({settings: null}, {data: null});
 */
export const fromObject = (Class) => {
  const container = Container.instance ?? new Container();
  // @ts-ignore
  container.registerTransient(Class);
  Object.assign(Class, {
    /**
     * @param {...any} source
     * @returns {any}
     */
    fromObject: (...source) => Object.assign(container.get(Class), ...source),
  });
};
