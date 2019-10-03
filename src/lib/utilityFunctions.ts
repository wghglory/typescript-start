import { Category } from '../enums';
import { Book, Magazine } from '../interfaces';

export function calculateLateFee(daysLate: number): number {
  return daysLate * 0.25;
}

export function maxBooksAllowed(age: number): number {
  if (age < 12) {
    return 3;
  } else {
    return 10;
  }
}

function privateFunc(): void {
  console.log('This is private...');
}

export function purge<T>(inventory: Array<T>): Array<T> {
  // implement fancy logic here...
  return inventory.splice(2, inventory.length);
}

export function getAllBooks(): Book[] {
  let books = [
    { id: 1, title: 'Ulysses', author: 'James Joyce', available: true, category: Category.Fiction },
    {
      id: 2,
      title: 'A Farewell to Arms',
      author: 'Ernest Hemingway',
      available: false,
      category: Category.Fiction,
    },
    {
      id: 3,
      title: 'I Know Why the Caged Bird Sings',
      author: 'Maya Angelou',
      available: true,
      category: Category.Poetry,
    },
    {
      id: 4,
      title: 'Moby Dick',
      author: 'Herman Melville',
      available: true,
      category: Category.Fiction,
    },
  ];

  return books;
}

export function getAllMagazines(): Magazine[] {
  let magazines: Magazine[] = [
    { title: 'Python Programmer Review', publisher: 'Smarty Publishing' },
    { title: 'Five Points', publisher: 'Georgia State University' },
    { title: 'Poetry Quarterly', publisher: 'Literary Press' },
    { title: 'Baseball News', publisher: 'Sports Press' },
  ];

  return magazines;
}

export function logFirstAvailable(books = getAllBooks()): void {
  let numberOfBooks: number = books.length;
  let firstAvailable: string = '';

  for (let currentBook of books) {
    if (currentBook.available) {
      firstAvailable = currentBook.title;
      break;
    }
  }

  console.log('Total Books: ' + numberOfBooks);
  console.log('First Available: ' + firstAvailable);
}

export function getBookTitlesByCategory(
  categoryFilter: Category = Category.Fiction,
): Array<string> {
  console.log('Getting books in category: ' + Category[categoryFilter]);

  const allBooks = getAllBooks();
  const filteredTitles: string[] = [];

  for (let currentBook of allBooks) {
    if (currentBook.category === categoryFilter) {
      filteredTitles.push(currentBook.title);
    }
  }

  return filteredTitles;
}

export function logBookTitles(titles: string[]): void {
  for (let title of titles) {
    console.log(title);
  }
}

export function getBookByID(id: number): Book {
  const allBooks = getAllBooks();
  return allBooks.filter((book) => book.id === id)[0];
}

export function createCustomerID(name: string, id: number): string {
  return name + id;
}

export function createCustomer(name: string, age?: number, city?: string): void {
  console.log('Creating customer ' + name);

  if (age) {
    console.log('Age: ' + age);
  }

  if (city) {
    console.log('City: ' + city);
  }
}

export function checkoutBooks(customer: string, ...bookIDs: number[]): string[] {
  console.log('Checking out books for ' + customer);

  let booksCheckedOut: string[] = [];

  for (let id of bookIDs) {
    let book = getBookByID(id);
    if (book.available) {
      booksCheckedOut.push(book.title);
    }
  }

  return booksCheckedOut;
}

export function getTitles(author: string): string[];
export function getTitles(available: boolean): string[];
export function getTitles(bookProperty: any): string[] {
  const allBooks = getAllBooks();
  const foundTitles: string[] = [];

  if (typeof bookProperty === 'string') {
    // get all books by a particular author
    for (let book of allBooks) {
      if (book.author === bookProperty) {
        foundTitles.push(book.title);
      }
    }
  } else if (typeof bookProperty === 'boolean') {
    // get all books based on specified availability
    for (let book of allBooks) {
      if (book.available === bookProperty) {
        foundTitles.push(book.title);
      }
    }
  }
  return foundTitles;
}

export function printBook(book: Book): void {
  console.log(book.title + ' by ' + book.author);
}
