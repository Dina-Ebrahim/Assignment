//create
export const create = async ({ model, data = [], options = {} } = {}) => {
  return await model.create(data, options);
};

//createOne
export const createOne = async ({ model, data, options = {} } = {}) => {
  cosnt[doc] = (await model.create(data, options)) || [];
  return doc;
};

//findOne
export const findOne = async ({
  model,
  filter = {},
  select = "",
  options = {},
} = {}) => {
  let query = model.findOne(filter).select(select);

  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.lean) {
    query = query.lean();
  }

  return await query.exec();
};

//findById
export const findById = async ({
  id,
  options = {},
  select = "",
  model,
} = {}) => {
  let query = model.findById(id).select(select);

  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.lean) {
    query = query.lean(options.lean);
  }

  return await query.exec();
};

//find
export const find = async ({
  filter = {},
  options = {},
  select = "",
  model,
} = {}) => {
  let query = model.find(filter).select(select);

  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.skip) {
    query = query.skip(options.skip);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.lean) {
    query = query.lean(options.lean);
  }

  return await query.exec();
};

//insertMany
export const insertMany = async ({ data, model }) => {
  return await model.insertMany(data);
};

//updateOne
export const updateOne = async ({ filter, update, options, model } = {}) => {
  return await model.updateOne(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    options,
  );
};

//findOneAndUpdate
export const findOneAndUpdate = async ({
  filter,
  update,
  options,
  model,
} = {}) => {
  return await model.findOneAndUpdate(
    filter || {},
    { ...update, $inc: { __v: 1 } },
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );
};

//findByIdAndUpdate
export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true },
  model,
} = {}) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    { new: true, ...options },
  );
};

//deleteOne
export const deleteOne = async ({ filter, model } = {}) => {
  return await model.deleteOne(filter || {});
};

//deleteMany
export const deleteMany = async ({ filter, model } = {}) => {
  return await model.deleteMany(filter || {});
};

// findOneAndDelete
export const findOneAndDelete = async ({
  filter,
  options = {},
  model,
} = {}) => {
  return await model.findOneAndDelete(filter || {}, options);
};
