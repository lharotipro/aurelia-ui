/**
 * Gère la fonctionnalité de verrouillage logique de l'affichage
 */
export class LockService {
  /** @type {boolean} */ isLocked = false;

    
  constructor() {}

  lock() {
    this.isLocked = true;
  }

  unlock() {
    this.isLocked = false;
  }
}
