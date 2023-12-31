import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { UsernameValidator } from '../../validators/username.validator';
import { PasswordValidator } from '../../validators/password.validator';
import { PhoneValidator } from '../../validators/phone.validator';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';
import { CountryPhone } from './country-phone.model';

@Component({
  selector: 'app-forms-validations-page',
  templateUrl: './forms-validations.page.html',
  styleUrls: [
    './styles/forms-validations.page.scss'
  ]
})
export class FormsValidationsPage implements OnInit {

  validationsForm: UntypedFormGroup;
  matching_passwords_group: UntypedFormGroup;
  country_phone_group: UntypedFormGroup;
  countries: Array<CountryPhone>;
  genders: Array<string>;

  validations = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'usernameNotAvailable', message: 'Your username is already taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'invalidCountryPhone', message: 'Phone is incorrect for the selected country.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Password confirmation is required.' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ],
    'guests': [
      { type: 'rangeError', message: 'Number must be between: ' }
    ],
    'bedrooms': [
      { type: 'rangeError', message: 'Number must be between: ' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ]
  };

  constructor() { }

  ngOnInit(): void {
    //  We just use a few random countries, however, you can use the countries you need by just adding them to this list.
    // also you can use a library to get all the countries from the world.
    this.countries = [
      new CountryPhone('UY', 'Uruguay'),
      new CountryPhone('US', 'United States'),
      new CountryPhone('ES', 'España'),
      new CountryPhone('BR', 'Brasil'),
      new CountryPhone('FR', 'France')
    ];

    this.genders = [
      'Female',
      'Male',
      'Other'
    ];

    this.matching_passwords_group = new UntypedFormGroup({
      password: new UntypedFormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new UntypedFormControl('', Validators.required)
    }, (formGroup: UntypedFormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    const country = new UntypedFormControl(this.countries[0], Validators.required);

    const phone = new UntypedFormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.invalidCountryPhone(country)
    ]));
    this.country_phone_group = new UntypedFormGroup({
      country: country,
      phone: phone
    });

    this.validationsForm = new UntypedFormGroup({
      'username': new UntypedFormControl('', Validators.compose([
        UsernameValidator.usernameNotAvailable,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      'name': new UntypedFormControl('', Validators.required),
      'lastname': new UntypedFormControl('', Validators.required),
      'email': new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'gender': new UntypedFormControl(this.genders[0], Validators.required),
      'country_phone': this.country_phone_group,
      'matching_passwords': this.matching_passwords_group,
      'guests': new UntypedFormControl(6, counterRangeValidator(1, 12)),
      'bedrooms': new UntypedFormControl(3, counterRangeValidator(1, 5)),
      'terms': new UntypedFormControl(true, Validators.pattern('true'))
    });
  }

  onSubmit(values) {
    console.log(values);
  }
}
