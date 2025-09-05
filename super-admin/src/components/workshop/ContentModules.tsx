// ContentModules Component
// Handles content modules management with dynamic add/remove functionality

import { Plus, Trash2 } from 'lucide-react'
import { WorkshopFormData } from '@/types/workshop'

interface ContentModulesProps {
  formData: WorkshopFormData
  hasFieldError: (field: keyof WorkshopFormData) => boolean
  getFieldError: (field: keyof WorkshopFormData) => string | null
  // Highlights functions
  addHighlight: (highlight: string) => void
  removeHighlight: (index: number) => void
  updateHighlight: (index: number, highlight: string) => void
  // Syllabus functions
  addSyllabusDay: (day: any) => void
  removeSyllabusDay: (index: number) => void
  updateSyllabusDay: (index: number, day: any) => void
  // Materials functions
  addMaterial: (category: 'hardware' | 'software' | 'onlineResources', item: string) => void
  removeMaterial: (category: 'hardware' | 'software' | 'onlineResources', index: number) => void
  updateMaterial: (category: 'hardware' | 'software' | 'onlineResources', index: number, item: string) => void
  // Assessment functions
  addAssessment: (assessment: any) => void
  removeAssessment: (index: number) => void
  updateAssessment: (index: number, assessment: any) => void
  // Learning Outcomes functions
  addLearningOutcome: (outcome: string) => void
  removeLearningOutcome: (index: number) => void
  updateLearningOutcome: (index: number, outcome: string) => void
}

export default function ContentModules({
  formData,
  hasFieldError,
  getFieldError,
  addHighlight,
  removeHighlight,
  updateHighlight,
  addSyllabusDay,
  removeSyllabusDay,
  updateSyllabusDay,
  addMaterial,
  removeMaterial,
  updateMaterial,
  addAssessment,
  removeAssessment,
  updateAssessment,
  addLearningOutcome,
  removeLearningOutcome,
  updateLearningOutcome
}: ContentModulesProps) {
  return (
    <div className="space-y-8">
      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Highlights * (Minimum 1 required)
          </label>
          <button
            type="button"
            onClick={() => addHighlight('')}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            title="Add highlight"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Highlight
          </button>
        </div>
        <div className="space-y-3">
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasFieldError('highlights') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter workshop highlight"
                title="Workshop highlight"
              />
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Remove highlight"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {hasFieldError('highlights') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('highlights')}</p>
        )}
      </div>

      {/* Syllabus */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Syllabus * (Minimum 1 day required)
          </label>
          <button
            type="button"
            onClick={() => addSyllabusDay({ day: formData.syllabus.length + 1, title: '', objective: '', activities: [''] })}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            title="Add syllabus day"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Day
          </button>
        </div>
        <div className="space-y-4">
          {formData.syllabus.map((day, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Day {day.day}</h4>
                <button
                  type="button"
                  onClick={() => removeSyllabusDay(index)}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Remove syllabus day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateSyllabusDay(index, { ...day, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Day title"
                  title="Syllabus day title"
                />
                <textarea
                  value={day.objective}
                  onChange={(e) => updateSyllabusDay(index, { ...day, objective: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Day objective"
                  title="Syllabus day objective"
                  rows={2}
                />
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Activities:</label>
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => {
                          const newActivities = [...day.activities]
                          newActivities[activityIndex] = e.target.value
                          updateSyllabusDay(index, { ...day, activities: newActivities })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Activity description"
                        title="Syllabus day activity"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newActivities = day.activities.filter((_, i) => i !== activityIndex)
                          updateSyllabusDay(index, { ...day, activities: newActivities })
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                        title="Remove activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newActivities = [...day.activities, '']
                      updateSyllabusDay(index, { ...day, activities: newActivities })
                    }}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    title="Add activity"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Activity
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasFieldError('syllabus') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('syllabus')}</p>
        )}
      </div>

      {/* Materials */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Materials * (Minimum 1 item required in each category)</h3>
        <div className="space-y-4">
          {/* Hardware */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">Hardware</label>
              <button
                type="button"
                onClick={() => addMaterial('hardware', '')}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                title="Add hardware item"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.materials.hardware.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateMaterial('hardware', index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hardware item"
                    title="Hardware item"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterial('hardware', index)}
                    className="p-2 text-red-600 hover:text-red-700"
                    title="Remove hardware item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Software */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">Software</label>
              <button
                type="button"
                onClick={() => addMaterial('software', '')}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                title="Add software item"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.materials.software.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateMaterial('software', index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Software item"
                    title="Software item"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterial('software', index)}
                    className="p-2 text-red-600 hover:text-red-700"
                    title="Remove software item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Online Resources */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">Online Resources</label>
              <button
                type="button"
                onClick={() => addMaterial('onlineResources', '')}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                title="Add online resource"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.materials.onlineResources.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateMaterial('onlineResources', index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Online resource"
                    title="Online resource"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterial('onlineResources', index)}
                    className="p-2 text-red-600 hover:text-red-700"
                    title="Remove online resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {hasFieldError('materials') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('materials')}</p>
        )}
      </div>

      {/* Assessment */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Assessment * (Minimum 1 item required)
          </label>
          <button
            type="button"
            onClick={() => addAssessment({ item: '', weight: '', criteria: '' })}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            title="Add assessment item"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Assessment
          </button>
        </div>
        <div className="space-y-3">
          {formData.assessment.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Assessment Item {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAssessment(index)}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Remove assessment item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => updateAssessment(index, { ...item, item: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assessment item name"
                  title="Assessment item name"
                />
                <input
                  type="text"
                  value={item.weight}
                  onChange={(e) => updateAssessment(index, { ...item, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Weight (e.g., 40%)"
                  title="Assessment weight"
                />
                <textarea
                  value={item.criteria || ''}
                  onChange={(e) => updateAssessment(index, { ...item, criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assessment criteria (optional)"
                  title="Assessment criteria"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        {hasFieldError('assessment') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('assessment')}</p>
        )}
      </div>

      {/* Learning Outcomes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Learning Outcomes * (Minimum 1 required)
          </label>
          <button
            type="button"
            onClick={() => addLearningOutcome('')}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            title="Add learning outcome"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Outcome
          </button>
        </div>
        <div className="space-y-3">
          {formData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasFieldError('learningOutcomes') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter learning outcome"
                title="Learning outcome"
              />
              <button
                type="button"
                onClick={() => removeLearningOutcome(index)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Remove learning outcome"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {hasFieldError('learningOutcomes') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('learningOutcomes')}</p>
        )}
      </div>
    </div>
  )
}
