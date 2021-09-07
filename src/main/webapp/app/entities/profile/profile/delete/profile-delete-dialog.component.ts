import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfile } from '../profile.model';
import { ProfileService } from '../service/profile.service';

@Component({
  templateUrl: './profile-delete-dialog.component.html',
})
export class ProfileDeleteDialogComponent {
  profile?: IProfile;

  constructor(protected profileService: ProfileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profileService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
