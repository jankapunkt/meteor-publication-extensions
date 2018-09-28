/* global Meteor Mongo */

const _ExtendedPublications = new Mongo.Collection('__ExtendedPublications__')
const _pubCache = {}
const _status = {
  normal: 'normal',
  paused: 'paused',
  stopped: 'stopped',
  unpublished: 'unpublished'
}

function update (name, status) {
  return _ExtendedPublications.update({name}, {$set: {status}})
}

function register (name) {
  if (!_ExtendedPublications.findOne({name})) {
    return _ExtendedPublications.insert({name, status: _status.normal}) && name
  }
  return name
}

function wrap (func, name) {
  let lastArgs
  const wrappedPublication = function (...args) {
    const status = _ExtendedPublications.findOne({name}).status
    console.log(name, status, args)
    // throw error
    if (status === _status.unpublished) {
      throw new Meteor.Error('calledUnpublishedPublication', `Publication [${name}]is attempted to be called but it has already been unpublished.`)
    }
    // return empty cursor
    if (status === _status.stopped) {
      this.ready()
      return
    }
    // return latest query
    if (status === _status.paused) {
      return func.call(this, ...lastArgs)
    }
    lastArgs = args
    return func.call(this, ...args)
  }
  wrappedPublication.status = _status.normal
  return wrappedPublication
}

const originalPublish = Meteor.publish

Meteor.publish = function publish (name, func) {
  return originalPublish.call(this, register(name), wrap(func, name))
}

Meteor.publish.prototype = originalPublish.prototype

Meteor.stopPublication = function stopPublication (name) {
  return update(name, _status.stopped)
}

Meteor.pausePublication = function pausePublication (name) {
  return update(name, _status.paused)
}

Meteor.resumePublication = function resumePublication (name) {
  return update(name, _status.normal)
}

Meteor.unpublish = function resumePublication (name) {
  return update(name, _status.unpublished)
}
