import React from 'react'
import { Table } from "flowbite-react";

const AddCenterAdmin = () => {
  return (
    <div>
       <div className="overflow-x-auto">
        2nd
            <Table hoverable className="overflow-y-auto shadow-lg rounded-xl mt-2  shadow-gray-400 dark:shadow-none">
              <Table.Head>
                <Table.HeadCell>Student_Name</Table.HeadCell>
                <Table.HeadCell>Student_Email</Table.HeadCell>
                <Table.HeadCell>Student_Phone_Number</Table.HeadCell>
                <Table.HeadCell>Center_Name</Table.HeadCell>
                <Table.HeadCell>Operations</Table.HeadCell>
                
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {'Apple MacBook Pro 17"'}
                  </Table.Cell>
                  <Table.Cell>Sliver</Table.Cell>
                  <Table.Cell>Laptop</Table.Cell>
                  <Table.Cell>$2999</Table.Cell>

                  <Table.Cell>
                  <a
                      href="#"
                      className=" mr-4 text-red-600 font-semibold hover:underline dark:text-cyan-500"
                    >
                      Delete
                    </a>

                    <a
                      href="#"
                      className="text-blue-600 font-semibold hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
                
              </Table.Body>
            </Table>
          </div>
    </div>
  )
}

export default AddCenterAdmin