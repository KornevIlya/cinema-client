import { Place } from './place';
import { Vip } from './place';
import { Seat, Single, Sofa } from '../seat/seat-model';

/*export const PLACES: Place[] = [
   {cost: 200, brone: false, closet: true, seat: 1, row: 1, x: 1, y: 1  },
   {cost: 200, brone: false, closet: false, seat: 1, row: 2, x: 1, y: 2    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 3, x: 1, y: 3    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 4, x: 1, y: 4    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 5, x: 1, y: 5    },
   {cost: 200, brone: false , closet: false, seat: 1, row: 6, x: 1, y: 6   },
   {cost: 200, brone: false, closet: false, seat: 1, row: 7, x: 1, y: 7    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 8, x: 1, y: 8    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 9, x: 1, y: 9    },
   {cost: 200, brone: false, closet: false, seat: 1, row: 10, x: 1, y: 10  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 1, x: 2, y: 1  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 2, x: 2, y: 2  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 3, x: 2, y: 3  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 4, x: 2, y: 4  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 5, x: 2, y: 5  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 6, x: 2, y: 6  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 7, x: 2, y: 7  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 8, x: 2, y: 8  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 9, x: 2, y: 9  },
   {cost: 200, brone: false, closet: false, seat: 2, row: 10, x: 2, y: 10  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 1, x: 3, y: 1  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 2, x: 3, y: 2  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 3, x: 3, y: 3  },
   {cost: 200, brone: false, closet: false,  seat: 3, row: 4, x: 3, y: 4  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 5, x: 3, y: 5},
   {cost: 200, brone: false, closet: false, seat: 3, row: 6, x: 3, y: 6  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 7, x: 3, y: 7  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 8, x: 3, y: 8  },
   {cost: 200, brone: false, closet: false, seat: 3, row: 9, x: 3, y: 9 },
   {cost: 200, brone: false, closet: false, seat: 3, row: 10, x: 3, y: 10  },
   {cost: 200, brone: false, closet: false, seat: 4, row: 1, x: 4, y: 1  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 2, x: 4, y: 2  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 3, x: 4, y: 3  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 4, x: 4, y: 4  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 5, x: 4, y: 5  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 6, x: 4, y: 6  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 7, x: 4, y: 7  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 8, x: 4, y: 8  },
   {cost: 200,  brone: false, closet: false, seat: 4, row: 9, x: 4, y: 9  },
   {cost: 200, brone: false, closet: false, seat: 4, row: 10, x: 4, y: 10  },
   {cost: 200, brone: false, closet: false, seat: 5, row: 1, x: 5, y: 1 },
   {cost: 200, brone: false, closet: false, seat: 5, row: 2, x: 5, y: 2   },
   {cost: 200, brone: false, closet: false, seat: 5, row: 3, x: 5, y: 3   },
   {cost: 200, brone: false, closet: false, seat: 5, row: 4, x: 5, y: 4   },
   {cost: 200, brone: false, closet: false, seat: 5, row: 5, x: 5, y: 5   },
   {cost: 200,  brone: false, closet: false, seat: 5, row: 6, x: 5, y: 6   },
   {cost: 200,  brone: false, closet: false, seat: 5, row: 7, x: 5, y: 7   },
   {cost: 200,  brone: false, closet: false, seat: 5, row: 8, x: 5, y: 8   },
   {cost: 200, brone: false, closet: false, seat: 5, row: 9, x: 5, y: 9   },
   {cost: 200, brone: false, closet: false, seat: 5, row: 10, x: 5, y: 10  },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 1, x: 6, y: 1   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 2, x: 6, y: 2  },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 3, x: 6, y: 3   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 4, x: 6, y: 4   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 5, x: 6, y: 5   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 6, x: 6, y: 6   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 7, x: 6, y: 7   },
   {cost: 200,  brone: false, closet: false, seat: 6, row: 8, x: 6, y: 8   },
   {cost: 200, brone: false, closet: false, seat: 6, row: 9, x: 6, y: 9   },
   {cost: 200, brone: false, closet: false, seat: 6, row: 10, x: 6, y: 10 },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 1, x: 7, y: 1   },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 2, x: 7, y: 2   },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 3, x: 7, y: 3  },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 4, x: 7, y: 4  },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 5, x: 7, y: 5   },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 6, x: 7, y: 6  },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 7, x: 7, y: 7   },
   {cost: 200,  brone: false, closet: false, seat: 7, row: 8, x: 7, y: 8   },
   {cost: 200, brone: false, closet: false, seat: 7, row: 9, x: 7, y: 9   },
   {cost: 200, brone: false, closet: false, seat: 7, row: 10, x: 7, y: 10  },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 1, x: 8, y: 1    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 2, x: 8, y: 2    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 3, x: 8, y: 3    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 4, x: 8, y: 4    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 5, x: 8, y: 5    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 6, x: 8, y: 6    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 7, x: 8, y: 7    },
   {cost: 200,  brone: false, closet: false, seat: 8, row: 8, x: 8, y: 8    },
   {cost: 200, brone: false, closet: false, seat: 8, row: 9, x: 8, y: 9    },
   {cost: 200, brone: false, closet: false, seat: 8, row: 10, x: 8, y: 10  },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 1, x: 9, y: 1    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 2, x: 9, y: 2   },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 3, x: 9, y: 3    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 4, x: 9, y: 4    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 5, x: 9, y: 5    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 6, x: 9, y: 6    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 7, x: 9, y: 7    },
   {cost: 200,  brone: false, closet: false, seat: 9, row: 8, x: 9, y: 8    },
   {cost: 200, brone: false, closet: false, seat: 9, row: 9, x: 9, y: 9    },
   {cost: 200, brone: false, closet: false, seat: 9, row: 10, x: 9, y: 10  },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 1, x: 10, y: 1    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 2, x: 10, y: 2   },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 3, x: 10, y: 3    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 4, x: 10, y: 4    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 5, x: 10, y: 5    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 6, x: 10, y: 6    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 7, x: 10, y: 7    },
   {cost: 200,  brone: false, closet: false, seat: 10, row: 8, x: 10, y: 8    },
   {cost: 200, brone: false, closet: false, seat: 10, row: 9, x: 10, y: 9    },
   {cost: 200, brone: false, closet: false, seat: 10, row: 10, x: 10, y: 10  },
];

export const VIPS: Vip[] = [
  {cost: 400,  brone: false, closet: true, seat: 1, row: 1, x: 0, y: 0},
  {cost: 400,  brone: false, closet: false, seat: 2, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: true, seat: 3, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: false, seat: 4, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: true, seat: 5, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: false, seat: 6, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: true, seat: 7, row: 1, x: 0, y: 0  },
  {cost: 400,  brone: false, closet: false, seat: 8, row: 1, x: 0, y: 0  },
];*/
const PLACES: Seat[] = [
  /*
  {
    x: 1,
    y: 1,
    closet: false,
    brone: false,
    number: 1,
    row: 1,
    type: new Single(),
    price: 200
  },
  {
    x: 3 ,
    y: 2,
    closet: false,
    brone: false,
    number: 2,
    row: 1,
    type: new Single(),
    price: 200
  },
  {
    x: 5,
    y: 1,
    closet: false,
    brone: false,
    number: 3,
    row: 1,
    type: new Single(),
    price: 200
  },
  {
    x: 1 ,
    y: 4,
    closet: false,
    brone: false,
    number: 1,
    row: 2,
    type: new Sofa(),
    price: 200
  }*/
]
let corona = true
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 20; j++) {
	 if((i + j)%2 == 0)
	 {
		corona = true;
	 }
	 else
	 {
		corona = false;
	 }
    PLACES.push({
      x: j + 1,
      y: i + 1,
      closet: corona,
      brone: false,
      number: j + 1,
      row: i + 1,
      type: new Single(),
      price: 200
    })
  }
}
let number = 1
for (let j = 0; j < 20; j += 2) {
	 if(j%4 != 2)
	 {
		corona = true;
	 }
	 else
	 {
		corona = false;
	 } 
  PLACES.push({
    x: j + 1,
    y: 15 + 1,
    closet: corona,
    brone: false,
    number,
    row: 15 + 1,
    type: new Sofa(2),
    price: 400
  })
  number++
}

const HEIGHT = 15
const WIDTH = 20
const SEAT_WIDTH = 1
export { PLACES, WIDTH, HEIGHT, SEAT_WIDTH }

