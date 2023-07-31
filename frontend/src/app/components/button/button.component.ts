import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'button[app-button], a[app-button]',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() type: 'raised' | 'icon' | 'text' = 'raised';
  @Input() size: 'md' | 'lg' = 'md';
  @HostBinding('class.disabled') @Input() disabled: boolean | null | undefined = false;
  @HostBinding('class') classes: string[] = [];

  ngOnInit() {
    this.classes.push(this.size === 'md' ? 'size-md' : 'size-lg');
    this.classes.push(this.type);
  }
}
