import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHeight } from '../height.model';
import { HeightService } from '../service/height.service';
import { HeightDeleteDialogComponent } from '../delete/height-delete-dialog.component';

@Component({
  selector: 'jhi-height',
  templateUrl: './height.component.html',
})
export class HeightComponent implements OnInit {
  heights?: IHeight[];
  isLoading = false;

  constructor(protected heightService: HeightService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.heightService.query().subscribe(
      (res: HttpResponse<IHeight[]>) => {
        this.isLoading = false;
        this.heights = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHeight): number {
    return item.id!;
  }

  delete(height: IHeight): void {
    const modalRef = this.modalService.open(HeightDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.height = height;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
