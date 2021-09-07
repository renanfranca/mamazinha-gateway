import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBreastFeed } from '../breast-feed.model';
import { BreastFeedService } from '../service/breast-feed.service';
import { BreastFeedDeleteDialogComponent } from '../delete/breast-feed-delete-dialog.component';

@Component({
  selector: 'jhi-breast-feed',
  templateUrl: './breast-feed.component.html',
})
export class BreastFeedComponent implements OnInit {
  breastFeeds?: IBreastFeed[];
  isLoading = false;

  constructor(protected breastFeedService: BreastFeedService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.breastFeedService.query().subscribe(
      (res: HttpResponse<IBreastFeed[]>) => {
        this.isLoading = false;
        this.breastFeeds = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBreastFeed): number {
    return item.id!;
  }

  delete(breastFeed: IBreastFeed): void {
    const modalRef = this.modalService.open(BreastFeedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.breastFeed = breastFeed;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
