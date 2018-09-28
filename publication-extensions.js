/* global Meteor Mongo */

const _ExtendedPublications = new Mongo.Collection('__ExtendedPublications__')
const _pubCache = {}
const _status = {
  normal: 'normal',
  paused: 'paused',
  stopped: 'stopped',
  unpublished: 'unpublished'
}

function getPub (name) {
  return _pubCache[name]
}

function isRegistered (name) {
  return _ExtendedPublications.findOne({name})
}

function register (name) {
  return _ExtendedPublications.insert({name, status: _status.normal}) && name
}

function wrap (func) {
  let lastArgs
  return function wrappedPublication (...args) {
    // throw error
    if (this._status === _status.unpublished) {
      throw new Meteor.Error('calledUnpublishedPublication', 'A publication is attempted to be called but it has already been unpublished.')
    }
    // return empty cursor
    if (this._status === _status.stopped) {
      this.ready()
      return
    }
    // return latest query
    if (this._status === _status.paused) {
      return func.call(this, ...lastArgs)
    }
    lastArgs = args
    return func.call(this, ...args)
  }
}

const originalPublish = Meteor.publish

Meteor.publish = function publish (name, func) {
  const wrappedFunc = wrap(func)
  _pubCache[name] = wrappedFunc
  if (isRegistered(name)) {

  } else {
    register(name)
    return originalPublish.call(this, name, wrappedFunc)
  }
}

Meteor.publish.prototype = originalPublish.prototype

Meteor.stopPublication = function stopPublication (name) {
  const pub = getPub(name)
  pub._status = _status.stopped
}

Meteor.pausePublication = function pausePublication (name) {
  const pub = getPub(name)
  pub._status = _status.paused
}

Meteor.resumePublication = function resumePublication (name) {
  const pub = getPub(name)
  pub._status = _status.normal
}

Meteor.unpublish = function resumePublication (name) {
  const pub = getPub(name)
  pub._status = _status.unpublished
}
