<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "description",
        "story_points",
        "epic_id",
        "state_id",
        "project_id",
        "user_id",
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function epic()
    {
        return $this->belongsTo(Epic::class, "epic_id");
    }
    public function state()
    {
        return $this->belongsTo(State::class, "state_id");
    }
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, "story_id");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
