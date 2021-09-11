import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'baby-profile',
        data: { pageTitle: 'gatewayApp.babyprofileBabyProfile.home.title' },
        loadChildren: () => import('./babyprofile/baby-profile/baby-profile.module').then(m => m.BabyprofileBabyProfileModule),
      },
      {
        path: 'breast-feed',
        data: { pageTitle: 'gatewayApp.babyprofileBreastFeed.home.title' },
        loadChildren: () => import('./babyprofile/breast-feed/breast-feed.module').then(m => m.BabyprofileBreastFeedModule),
      },
      {
        path: 'height',
        data: { pageTitle: 'gatewayApp.babyprofileHeight.home.title' },
        loadChildren: () => import('./babyprofile/height/height.module').then(m => m.BabyprofileHeightModule),
      },
      {
        path: 'humor-history',
        data: { pageTitle: 'gatewayApp.babyprofileHumorHistory.home.title' },
        loadChildren: () => import('./babyprofile/humor-history/humor-history.module').then(m => m.BabyprofileHumorHistoryModule),
      },
      {
        path: 'nap',
        data: { pageTitle: 'gatewayApp.babyprofileNap.home.title' },
        loadChildren: () => import('./babyprofile/nap/nap.module').then(m => m.BabyprofileNapModule),
      },
      {
        path: 'weight',
        data: { pageTitle: 'gatewayApp.babyprofileWeight.home.title' },
        loadChildren: () => import('./babyprofile/weight/weight.module').then(m => m.BabyprofileWeightModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
