import Transaction from '../models/transaction.model.js';

const transactionResolver = {
  Query: {
    transactions: async (_, args, context) => {
      try {
        if (!context.getUser()) {
          throw new Error('Unauthorized');
        }
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        console.log(transactions);
        return transactions;
      } catch (error) {
        console.error('Error getting transactions: ', err);
        throw new Error('Error getting transactions');
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error('Error getting one transaction: ', err);
        throw new Error('Error getting one transaction');
      }
    },
    // TODO
    // categoryStatistics: () => {},
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error('Error in createTransaction: ', err);
        throw new Error(err.message || 'error creating transaction');
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.error('Error in updateTransaction: ', err);
        throw new Error(err.message || 'Error in updateTransaction');
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.error('Error in deleteTransaction: ', err);
        throw new Error(err.message || 'Internal server error');
      }
    },
  },
  //   TODO => ADD transaction/user relation
};

export default transactionResolver;
