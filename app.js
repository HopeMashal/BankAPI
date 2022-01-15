const express = require('express');
const app = express();
const fs = require('fs');

//! Functions
// Get all details of all the users
const AllUsersData = () => {
    try {
        const dataBuffer = fs.readFileSync('./data.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

//  Get all details of a particular user
const UserData = (id) => {
    const allUsers = AllUsersData();
    const user = allUsers.find(user => user.id === id)
    if (user) {
        return user;
    } else {
        throw new Error('User does not exist, check the ID you entered')
    }
}

// Add new user
const addNewUser = (user) => {
    const allUsers = AllUsersData();
    const checkUsersID = allUsers.find(userFound => userFound.id === user.id)
    const checkUsersName = allUsers.find(userFound => userFound.name===user.name)
    if (!checkUsersID && !checkUsersName) {
        if ((!user.id || user.id.length != 9)&&(!user.name || user.name.length === 0)) {
            throw new Error('The ID must be 9 digits with numbers only! You must enter full name with letters only!')
        }
        if (!user.id || user.id.length != 9) {
            throw new Error('The ID must be 9 digits with numbers only!')
        }
        if (!user.name || user.name.length === 0) {
            throw new Error('You must enter full name with letters only!')
        }
        allUsers.push({
            id: user.id,
            name: user.name,
            isActive: user.isActive || false,
            credit: user.credit || 0,
            cash: user.cash || 0,
        });
        UpdateUsersData(allUsers);
        return (`New User Added \n The user ID: ${user.id} \n The user name: ${user.name}`);
    } else if(checkUsersName && !checkUsersID){
      if (!user.id || user.id.length != 9) {
        throw new Error(`The user name is already exist in the DataBase! The ID must be 9 digits with numbers only!`)
      }
      else throw new Error('The user name is already exist in the DataBase! ')
    } else if(checkUsersID && !checkUsersName){
      if (!user.name || user.name.length === 0) {
          throw new Error(`The user ID is already exist in the DataBase! You must enter full name with letters only!`)
      }
      else throw new Error('The user ID is already exist in the DataBase!')
    }  else {
        throw new Error('The user is already exist in the DataBase!')
    }
}

// Activate function
const activateUser = (id, isActive) => {
    const allUsers = AllUsersData();
    const user = allUsers.findIndex(user => user.id === id)
    if (user === -1) {
      throw new Error('User does not exist, check the ID you entered')
    }
    allUsers[user] = { ...allUsers[user], isActive: isActive }
    UpdateUsersData(allUsers);
    return (`The user account who owns the ID ${id} is ${isActive ? 'active' : 'inactive'}`);
}

// Deposit cash to a user
const depositCash = (id, amount) => {
    const allUsers = AllUsersData();
    const user = allUsers.findIndex(user => user.id === id);
    if (user === -1) {
      throw new Error('User does not exist, check the ID you entered')
    }
    if (!allUsers[user].isActive) {
      throw new Error('The user account is not active! Please activate the account.')
    }
    allUsers[user] = {...allUsers[user], cash: allUsers[user].cash + Number(amount)}
    UpdateUsersData(allUsers);
    return (`The user account who owns the ID ${id} now contains ${allUsers[user].cash} yens cash.`);
}

// Update a user credit (only positive numbers)
const updateCredit = (id, creditValue) => {
    const allUsers = AllUsersData();
    const user = allUsers.findIndex(user => user.id === id)
    if (user === -1) {
      throw new Error('User does not exist, check the ID you entered')
    }
    if (!allUsers[user].isActive) {
      throw new Error('The user account is not active! Please activate the account.')
    }
    if (!Number(creditValue) || Number(creditValue) < 0) {
      throw new Error('The credit value must be only positive number')
    }
    allUsers[user] = {...allUsers[user], credit: Number(creditValue)}
    UpdateUsersData(allUsers);
    return (`The user account who owns the ID ${id} now contains ${allUsers[user].credit} yens credit.`);
}

//Withdraw money from the user account
const withdrawMoney = (id, amount) => {
    const allUsers = AllUsersData();
    const user = allUsers.findIndex(user => user.id === id)
    if (user === -1) {
      throw new Error('User does not exist, check the ID you entered')
    }
    if (!allUsers[user].isActive) {
      throw new Error('The user account is not active! Please activate the account.')
    }
    if (!Number(amount) || Number(amount) < 0) {
      throw new Error('The money value must be only positive number')
    }
    if ((allUsers[user].cash + allUsers[user].credit - Number(amount)) >= 0) {
      if (allUsers[user].cash>0 && allUsers[user].cash>Number(amount)){
        allUsers[user] = {...allUsers[user], cash: allUsers[user].cash - Number(amount)}
        UpdateUsersData(allUsers);
        return (`The user account who owns the ID ${id} now contains ${allUsers[user].cash} yens cash.`);
      } else if (allUsers[user].cash<Number(amount)) {
        let NewValue=Number(amount)-allUsers[user].cash;
        allUsers[user] = {...allUsers[user], cash:0 , credit: allUsers[user].credit - NewValue}
        UpdateUsersData(allUsers);
        return (`The user account who owns the ID ${id} now contains ${allUsers[user].credit} yens credit.`);
      } else {
        allUsers[user] = {...allUsers[user], credit: allUsers[user].credit - Number(amount)}
        UpdateUsersData(allUsers);
        return (`The user account who owns the ID ${id} now contains ${allUsers[user].credit} yens credit.`);
      }
    } else {
        throw new Error(`Your account does not have enough money to do this operation`)
    }
}

// Transfer money from one user to another
const transferMoney = (idFrom,idTo,amount) => {
    withdrawMoney(idFrom, amount);
    return depositCash(idTo, amount)
}

// Fetch the users that are active and have a specified amount of cash.
const filterActive = (fromAmount,toAmount) => {
    const allUsers = AllUsersData();
    const filterUsers = allUsers.filter(userFound => {
        return userFound.cash >= fromAmount && userFound.cash <= toAmount && userFound.isActive === true;
    })
    return filterUsers;
}

// Update users data
const UpdateUsersData = (allUsers) => {
  const dataJSON = JSON.stringify(allUsers);
  fs.writeFileSync('./data.json', dataJSON);
}

//! GET, POST, PUT Methods
app.use(express.json())

// Get all details of all the users
app.get('/Users', (req, res) => {
  res.status(200).send(AllUsersData())
})

// Get all details of a particular user
app.get('/Users/:id', (req, res) => {
  try {
      res.status(200).send(UserData(req.params.id))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Add new user.
app.post('/Users', (req, res) => {
  try {
      res.status(200).send(addNewUser(req.body))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Activate Function
app.put('/Users/:id/active', (req, res) => {
  try {
      res.status(200).send(activateUser(req.params.id, true))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Inactivate Function
app.put('/Users/:id/inactive', (req, res) => {
  try {
      res.status(200).send(activateUser(req.params.id, false))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Deposit cash to a user
app.put('/Users/deposit/:id/:amount', (req, res) => {
  try {
      res.status(200).send(depositCash(req.params.id, req.params.amount))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

//Update a user credit (only positive numbers)
app.put('/Users/credit/:id/:creditvalue', (req, res) => {
  try {
      res.status(200).send(updateCredit(req.params.id, req.params.creditvalue))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

//Withdraw money from the user account
app.put('/Users/withdraw/:id/:amount', (req, res) => {
  try {
      res.status(200).send(withdrawMoney(req.params.id, req.params.amount))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Transfer money from one user to another
app.put('/Users/transfer/:idFrom/:idTo/:amount', (req, res) => {
  try {
      res.status(200).send(transferMoney(req.params.idFrom,req.params.idTo,req.params.amount))
  } catch (e) {
      res.status(400).send({ error: e.message })
  }
})

// Fetch the users that are active and have a specified amount of cash.
app.get('/Users/filter/:fromAmount/:toAmount', (req, res) => {
    try {
        res.status(200).send(filterActive(req.params.fromAmount,req.params.toAmount))
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})