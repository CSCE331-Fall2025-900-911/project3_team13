// Type definition for our menu items
export type MenuItem = {
    id: number;
    name: string;
    price: number;
    icon: string;
    modifications?: string[];
};

// Import the React logo (you can change this to other images later)
import reactLogo from '../assets/react.svg';

// Dummy data array
export const dummyItems: MenuItem[] = [
    {
        id: 1,
        name: "Milk Tea",
        price: 12.99,
        icon: reactLogo,
        modifications: ['Large', 'No sugar', 'Extra ice', 'No tea']
    },
    {
        id: 2,
        name: "Unicorn Tea",
        price: 5.99,
        icon: reactLogo
    },
    {
        id: 3,
        name: "Milk Tea",
        price: 12.99,
        icon: reactLogo,
        modifications: ['Large', 'No sugar', 'Extra ice', 'No tea']
    },
    {
        id: 4,
        name: "Unicorn Tea",
        price: 5.99,
        icon: reactLogo
    },
    {
        id: 5,
        name: "Milk Tea",
        price: 12.99,
        icon: reactLogo,
        modifications: ['Large', 'No sugar', 'Extra ice', 'No tea']
    },
    {
        id: 6,
        name: "Unicorn Tea",
        price: 5.99,
        icon: reactLogo
    }
];

// Helper to format prices consistently
export const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
};