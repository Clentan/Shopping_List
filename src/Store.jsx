import React, { useEffect, useReducer, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Search } from 'lucide-react';


const initialState = {
  name: '',
  quantity: '0',
  tags: '',
  note: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'Name':
      return { ...state, name: action.payload };
    case 'Quantity':
      return { ...state, quantity: action.payload };
    case 'Note':
      return { ...state, note: action.payload };
    case 'Tags':
      return { ...state, tags: action.payload };
    case 'Reset':
      return initialState;
    default:
      return state;
  }
}

export default function Store() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [items, setItems] = useState([]); // Store submitted items
  const [placement, setPlacement] = useState("top");
  const [editingItem, setEditingItem] = useState(null); // Track item being edited
  const [listId, setListId] = useState(null); // For shared list ID
  const[searchQuery,setSearchQuery]=useState('')

  useEffect(() => {
    fetch("http://localhost:3000/shopping_list")
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setItems(data); // Set fetched items to state
      })
      .catch((error) => {
        console.log('Error fetching items:', error);
      });
  }, []);


  function HandleSort() {
    const sorted = [...items].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setItems(sorted);
  }

  function HandleFormSubmit(e) {
    e.preventDefault();

    const newItem = {
      name: state.name,
      quantity: state.quantity,
      note: state.note,
      tags: state.tags,
      id: Date.now(),
    };

    // If editing, update the item; otherwise, create a new one
    if (editingItem) {
      fetch(`http://localhost:3000/shopping_list/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Updated item:', data);
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === editingItem.id ? newItem : item
            )
          );
        })
        .catch((error) => {
          console.log('Error updating item:', error);
        });
    } else {
      fetch("http://localhost:3000/shopping_list", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Success:', data);
          setItems([...items, newItem]); // Add new item to items array
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }

    // Reset form fields
    dispatch({ type: 'Reset' });
    setEditingItem(null); // Reset editing item
    console.log(newItem);
  }

  // Function to filter items based on their tags
  const filterItemsByTag = (tag) => {
    return items
      .filter((item) => item.tags === tag)
      .filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };


  // Sorting out the data by using sort element


  // Function to delete an item by its ID
  const DeleteItemByID = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems); // Update state with the filtered array
  };

  // Function to handle editing an item
  const EditItem = (item) => {
    setEditingItem(item); // Set the item being edited
    dispatch({ type: 'Name', payload: item.name });
    dispatch({ type: 'Quantity', payload: item.quantity });
    dispatch({ type: 'Tags', payload: item.tags });
    dispatch({ type: 'Note', payload: item.note });
  };

  const HandleShareList = () => {
    fetch("http://localhost:3000/share_list", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items }) // Make sure `items` contains the correct data
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data.id) {
          setListId(data.id); // Assume the response contains the new list ID
          alert(`Shareable link: http://localhost:3000/shared/${data.id}`); // Notify user
        } else {
          alert('Failed to create shareable link');
        }
      })
      .catch((error) => {
        console.error('Error sharing list:', error);
        alert('Error sharing the list. Please try again later.');
      });
  };
  
  return (
    <div>
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative flex items-end px-4  pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
              <img
                className="object-cover w-full h-full"
                src="https://bestlifehere.com/wp-content/uploads/sites/4/2018/10/iStock-871227828-1-1024x683.jpg"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
              <div className="w-44 max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                <h3 className="text-4xl font-bold text-white">
                  Easy way to make your list Safe
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Do Your Shopping List here
              </h2>

              <form
                action="#"
                method="POST"
                className="mt-8"
                onSubmit={HandleFormSubmit}
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      Name Of Product
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        type="text"
                        placeholder="Enter product name"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        value={state.name}
                        onChange={(e) => dispatch({ type: 'Name', payload: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      Quantity
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        type="number"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        value={state.quantity}
                        onChange={(e) => dispatch({ type: 'Quantity', payload: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      Tags
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        list="browser"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        value={state.tags}
                        onChange={(e) => dispatch({ type: 'Tags', payload: e.target.value })}
                        placeholder="Choose or enter a tag"
                      />
                      <datalist id="browser">
                        <option value="Grocery"></option>
                        <option value="Household"></option>
                        <option value="Materials"></option>
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      Optional Notes
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        type="text"
                        placeholder="Notes"
                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        value={state.note}
                        onChange={(e) => dispatch({ type: 'Note', payload: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-medium text-white transition-all duration-200 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                      {editingItem ? 'Update Item' : 'Add to List'}
                    </button>
                            <button
                        onClick={HandleSort}
                          className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-medium text-black transition-all duration-200 bg--500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                      >
                        Sort
                      </button>
                      <button
  onClick={HandleShareList}
  className="inline-flex items-center justify-center px-4 py-2 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
>
  Share List
</button>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col px-4">
        <div className="flex w-full flex-col">
        <div className="relative mb-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full scroll px-20 py-2 pl-32 pr-4 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-100"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Tabs aria-label="Options">
            <Tab key="Groceries" title="Grocery List">
              <Card className="w-96">
                <CardBody className="max-h-64 overflow-y-auto">
                  {filterItemsByTag("Grocery").map((item) => (
                    <div key={item.id} className="border-b border-gray-300 mb-2 pb-2 item">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Tags:</strong> {item.tags}</p>
                      <p><strong>Notes:</strong> {item.note}</p>
                      <button onClick={() => EditItem(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => DeleteItemByID(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Household" title="Household List">
              <Card className="w-96">
                <CardBody className="max-h-64 overflow-y-auto">
                  {filterItemsByTag("Household").map((item) => (
                    <div key={item.id} className="border-b border-gray-300 mb-2 pb-2 item">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Tags:</strong> {item.tags}</p>
                      <p><strong>Notes:</strong> {item.note}</p>
                      <button onClick={() => EditItem(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => DeleteItemByID(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Materials" title="Materials List">
              <Card className="w-96">
                <CardBody className="max-h-64 overflow-y-auto">
                  {filterItemsByTag("Materials").map((item) => (
                    <div key={item.id} className="border-b border-gray-300 mb-2 pb-2 item">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Tags:</strong> {item.tags}</p>
                      <p><strong>Notes:</strong> {item.note}</p>
                      <button onClick={() => EditItem(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => DeleteItemByID(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
