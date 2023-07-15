import { useState, useEffect } from "react";
import logo from "./assets/Cyberbytelogo.jpeg";
import "./style.css";

export default function PetiCashForm({
  submit,
  setForm,
  form,
  itemForm,
  setItemForm,
}) {
  const [loadingAccount, setLoadingAccount] = useState(false);
  /**
   *
   * @param {FormDataEvent} event
   */
  const handleFormSubmbit = (event) => {
    event.preventDefault();
    submit(form);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    updateForm("items", [...form.items, itemForm]);
    setItemForm(() => ({ name: "", amount: 0 }));
  };
  const removeItem = (position) => {
    updateForm(
      "items",
      form.items.filter((_, index) => position !== index)
    );
  };

  const [banks, setBanks] = useState([]);
  const getBanks = async () => {
    const banks = await fetch("http://localhost:3000/get-banks", {
      method: "GET",
    }).then((res) => res.json());
    setBanks(banks.data);
  };
  const resolveAccount = async (bankCode, accountNumber) => {
    setLoadingAccount(true);
    const banks = await fetch("http://localhost:3000/resolve-bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        bank_code: bankCode,
      }),
    })
      .then((res) => res.json())
      .finally(() => {
        setLoadingAccount(false);
      });

    updateForm("accountDetails", {
      ...form.accountDetails,
      accountName: banks.data.account_name,
      number: accountNumber,
    });
  };
  useEffect(() => {
    getBanks();
  }, []);

  return (
    <>
      {/* <img src={logo} alt="logo" className="mx-auto w-48" /> */}
      {/* <h1 className="text-xl ">
        Fill in the required details
      </h1> */}
      {/* <p>{JSON.stringify(form)}</p> */}
      {/* <div className="relative top-0 bottom-0 right-0 left-0">
        <p>TRIAL</p>
      </div> */}
      <p className="text-xl text-center italic">Basic Details</p>
      <form
        className="max-w-lg mx-auto"
        onSubmit={handleFormSubmbit}
        onReset={() => setForm(initialState)}
      >
        <div className="mb-4">
          <label className="font-bold text-orange-500">Name: </label>
          <input
            placeholder="Please enter your name"
            required
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            className="border border-gray-400  rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="font-bold text-orange-500">Date: </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => updateForm("date", e.target.value)}
            className="border  border-gray-400 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <div>
            <p className="text-xl text-center italic">Account Details</p>
          </div>
          <label className="font-bold text-orange-500">Bank: </label>
          <select
            required
            value={form.accountDetails.bank}
            onChange={(e) => {
              const selectedBank = banks.find(
                (bank) => bank.code === e.target.value
              );
              updateForm("accountDetails", {
                ...form.accountDetails,
                bank: selectedBank.code,
                bank_name: selectedBank.name,
              });
            }}
            className="border border-gray-400 rounded p-2 w-full"
          >
            <option value="" disabled hidden>
              Select Bank
            </option>
            {banks.map((bank, index) => (
              <option value={bank.code} key={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
          <label className="font-bold text-orange-500">Account Number: </label>
          <input
            value={form.accountDetails.number}
            required
            // disabled={loadingAccount || form.accountDetails.bank.length !== 10}
            minLength={11}
            maxLength={11}
            onChange={(e) => {
              if (
                e.target.value.length === 10 &&
                form.accountDetails.bank.length
              ) {
                resolveAccount(form.accountDetails.bank, e.target.value);
              } else {
                updateForm("accountDetails", {
                  ...form.accountDetails,
                  number: e.target.value,
                });
              }
            }}
            className="border border-gray-400 rounded p-2 w-full"
          />
          {loadingAccount ? (
            <p className="text-green animate animate-pulse">Resolving...</p>
          ) : null}{" "}
          <label className="font-bold text-orange-500">Account Name: </label>
          <input
            disabled
            required
            value={form.accountDetails.accountName}
            className="border border-gray-400 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-orange-500">
            Please enter the items you wish to get a petty cash for...🤑💵
          </h3>
          <div className="flex items-center">
            <input
              value={itemForm.name}
              placeholder="Detail/item name"
              onChange={(e) =>
                setItemForm({ ...itemForm, name: e.target.value })
              }
              className="border border-gray-400 rounded p-2 w-full"
            />
            <input
              value={itemForm.amount}
              placeholder="Enter amount"
              type="number"
              onChange={(e) =>
                setItemForm({ ...itemForm, amount: e.target.value })
              }
              className="border border-gray-400 rounded p-2 ml-2 w-full"
            />
            <button
              className="border border-gray-400 rounded p-2 ml-2 hover:text-white hover:bg-orange-600"
              type="button"
              onClick={addItem}
            >
              add ➕
            </button>
          </div>
          <div>
            {form.items.length && (
              <>
                <div className="flex-col text-center">
                  <h3 className="font-bold">Items</h3>
                  <table className="w-full border">
                    <thead>
                      <tr className="border">
                        <th className="px-4 py-2 border">S/N</th>
                        <th className="px-4 py-2 border">Details/Item Name</th>
                        <th className="px-4 py-2 border">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((item, index) => (
                        <tr onDoubleClick={() => removeItem(index)} key={index}>
                          <td className="px-4 py-2 border"> {index + 1}</td>
                          <td className="px-4 py-2 border"> {item.name}</td>
                          <td className="px-4 py-2 border"> {item.amount}</td>
                          <td className="px-4 py-2 border">
                            <button
                              className="text-red-500 bg-transparent border-none"
                              onClick={() => removeItem(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="font-bold text-orange-500">Authorized By: </label>
          <input
            required
            value={form.authorizedBy}
            onChange={(e) => updateForm("authorizedBy", e.target.value)}
            className="border border-gray-400 rounded p-2 w-full"
          />
        </div>
        <div className="flex flex-row space-x-3">
          <button
            className="border border-gray-400 rounded p-2 hover:text-white hover:bg-orange-600"
            // onClick={}
          >
            Apply
          </button>
          <button
            className="border border-gray-400 rounded p-2 hover:text-white hover:bg-orange-600"
            type="reset"
          >
            reset
          </button>
        </div>
      </form>
    </>
  );
}