import { Subscription } from 'rxjs';

declare module 'rxjs/Subscription' {
  interface Subscription {
    /**
     * Add the current subscription to be disposed by another subscription.
     * @param {Subscription} subscription A Subscription instance.
     */
    toBeDisposedBy(subscription: Subscription): void;
  }
}

Subscription.prototype.toBeDisposedBy = function(subscription: Subscription): void {
  subscription.add(this);
};