import * as Interfaces from './interfaces';
import { sealed, logger, writable } from './decorators';

export class Employee {
  title: string;

  addToSchedule(): void {
    console.log('Employee added to schedule.');
  }

  logTitle(): void {
    console.log(`Employee has the title ${this.title}.`);
  }
}

export class Researcher {
  doResearch(topic: string): void {
    console.log(`Doing research on ${topic}.`);
  }
}

@logger
@sealed('UniversityLibrarian')
export class UniversityLibrarian implements Interfaces.Librarian, Employee, Researcher {
  name: string;
  email: string;
  department: string;

  assistCustomer(name: string) {
    console.log(this.name + ' is assisting ' + name);
  }

  @writable(true)
  assistFaculty() {
    console.log('Assisting faculty.');
  }

  // implementation of the following to be provided by the mixing function
  title: string;
  addToSchedule: () => void;
  logTitle: () => void;
  doResearch: (topic: string) => void;
}

@logger
export class PublicLibrarian implements Interfaces.Librarian {
  name: string;
  email: string;
  department: string;

  assistCustomer(name: string) {
    console.log('Assisting customer.');
  }

  @writable(false)
  teachCommunity() {
    console.log('Teaching community.');
  }
}

export abstract class ReferenceItem {
  private _publisher: string;
  static department = 'Research';

  constructor(public title: string, protected year: number) {
    console.log('Creating a new ReferenceItem...');
  }

  printItem() {
    console.log(`${this.title} was published in ${this.year}.`);
    console.log(`Department: ${ReferenceItem.department}`);
  }

  get publisher() {
    return this._publisher.toUpperCase();
  }

  set publisher(newPublisher: string) {
    this._publisher = newPublisher;
  }

  abstract printCitation(): void;
}
