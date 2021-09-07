import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHumorHistory } from '../humor-history.model';
import { HumorHistoryService } from '../service/humor-history.service';
import { HumorHistoryDeleteDialogComponent } from '../delete/humor-history-delete-dialog.component';

@Component({
  selector: 'jhi-humor-history',
  templateUrl: './humor-history.component.html',
})
export class HumorHistoryComponent implements OnInit {
  humorHistories?: IHumorHistory[];
  isLoading = false;

  constructor(protected humorHistoryService: HumorHistoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.humorHistoryService.query().subscribe(
      (res: HttpResponse<IHumorHistory[]>) => {
        this.isLoading = false;
        this.humorHistories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHumorHistory): number {
    return item.id!;
  }

  delete(humorHistory: IHumorHistory): void {
    const modalRef = this.modalService.open(HumorHistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.humorHistory = humorHistory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
