import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'breast-feed',
        data: { pageTitle: 'gatewayApp.profileBreastFeed.home.title' },
        loadChildren: () => import('./profile/breast-feed/breast-feed.module').then(m => m.ProfileBreastFeedModule),
      },
      {
        path: 'height',
        data: { pageTitle: 'gatewayApp.profileHeight.home.title' },
        loadChildren: () => import('./profile/height/height.module').then(m => m.ProfileHeightModule),
      },
      {
        path: 'humor-history',
        data: { pageTitle: 'gatewayApp.profileHumorHistory.home.title' },
        loadChildren: () => import('./profile/humor-history/humor-history.module').then(m => m.ProfileHumorHistoryModule),
      },
      {
        path: 'nap',
        data: { pageTitle: 'gatewayApp.profileNap.home.title' },
        loadChildren: () => import('./profile/nap/nap.module').then(m => m.ProfileNapModule),
      },
      {
        path: 'profile',
        data: { pageTitle: 'gatewayApp.profileProfile.home.title' },
        loadChildren: () => import('./profile/profile/profile.module').then(m => m.ProfileProfileModule),
      },
      {
        path: 'weight',
        data: { pageTitle: 'gatewayApp.profileWeight.home.title' },
        loadChildren: () => import('./profile/weight/weight.module').then(m => m.ProfileWeightModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
