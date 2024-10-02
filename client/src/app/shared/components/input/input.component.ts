import {
  Component,
  Host,
  Input,
  OnInit,
  Optional,
  SkipSelf,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() autocomplete = 'on';
  @Input() errors: {} | null = null;
  @Input() isRequired: boolean = false;
  @Input() formControlName: string | undefined;
  @Input() icon: string = '';

  generatedId = uuidv4();
  value: any = '';
  control: AbstractControl | null | undefined;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer
  ) {}

  ngOnInit() {
    if (this.controlContainer?.control && this.formControlName) {
      this.control = this.controlContainer?.control?.get(this.formControlName);
      this.isRequired = !!this.control?.hasValidator(Validators.required);
    }
  }

  getId(): string {
    return this.formControlName ? this.formControlName : this.generatedId;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }

  get showError(): boolean {
    return !!this.control?.touched && this.isRequired && !this.control?.valid;
  }
}
