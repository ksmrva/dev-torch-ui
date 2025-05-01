import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "base",
  template: ""
})
export class BaseComponent implements OnDestroy {

  private longLivingSubscriptions: Subscription[];

  constructor() {
    this.longLivingSubscriptions = [];
  }

  ngOnDestroy(): void {
    this.longLivingSubscriptions.forEach((longLivingSubscription: Subscription) => {
      longLivingSubscription.unsubscribe();
    });
  }

  addLongLivingSubscription(subscriptionToAdd: Subscription): void {
    if (subscriptionToAdd) {
      this.longLivingSubscriptions.push(subscriptionToAdd);
    } else {
      console.warn("Was provided a Long Living Subscription that was null/undefined, ignoring");
    }
  }

}
