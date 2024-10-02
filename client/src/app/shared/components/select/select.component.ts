import {
  Component,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
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
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() mandatory: boolean = false;
  @Input() optionalLabelDisplayed: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() options: { value: string; label: string; hexColor?: string }[] = [];
  @Input() isRequired: boolean = false;
  @Input() formControlName: string | undefined;

  @Output() ngModelChange = new EventEmitter<string>();

  generatedId = uuidv4();
  value: string | null = null;
  selectedOption: { value: string; label: string; hexColor?: string } | null =
    null;
  dropdownOpen = false;
  control: AbstractControl | null | undefined;

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer
  ) {}

  ngOnInit() {
    if (this.controlContainer?.control && this.formControlName) {
      this.control = this.controlContainer?.control?.get(this.formControlName);
      this.isRequired = !!this.control?.hasValidator(Validators.required);
      if (this.control?.value) {
        this.writeValue(this.control.value);
      }
    }
  }

  getId(): string {
    return this.formControlName ? this.formControlName : this.generatedId;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
    this.selectedOption =
      this.options.find((option) => option.value === value) || null;
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

  onSelect(option: { value: string; label: string; hexColor?: string }) {
    this.value = option.value;
    this.selectedOption = option;
    this.onChange(option.value); // Notify the parent component of the change
    this.ngModelChange.emit(option.value); // Emit the value to the ngModel
    this.dropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  get showError(): boolean {
    return !!this.control?.touched && this.isRequired && !this.control?.valid;
  }
}
