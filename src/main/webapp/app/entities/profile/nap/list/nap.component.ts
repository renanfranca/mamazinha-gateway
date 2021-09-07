import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INap } from '../nap.model';
import { NapService } from '../service/nap.service';
import { NapDeleteDialogComponent } from '../delete/nap-delete-dialog.component';

@Component({
  selector: 'jhi-nap',
  templateUrl: './nap.component.html',
})
export class NapComponent implements OnInit {
  naps?: INap[];
  isLoading = false;

  constructor(protected napService: NapService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.napService.query().subscribe(
      (res: HttpResponse<INap[]>) => {
        this.isLoading = false;
        this.naps = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INap): number {
    return item.id!;
  }

  delete(nap: INap): void {
    const modalRef = this.modalService.open(NapDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nap = nap;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
